"""
rag_engine.py
RAG Engine for ASTU Issue Tracker — ChromaDB + Gemini embedding + streaming.
"""
import os
import sys
import typing

# ======================================================================
# Python 3.14 / pydantic v1 compatibility patches (MUST run before chromadb)
# ======================================================================

# 1. Shim `resource` module on Windows (ChromaDB Settings uses RLIMIT_NOFILE)
if sys.platform == "win32" and "resource" not in sys.modules:
    import types as _t
    _res = _t.ModuleType("resource")
    _res.RLIMIT_NOFILE = 7
    _res.getrlimit = lambda _: (16384, 16384)
    _res.setrlimit = lambda *_: None
    sys.modules["resource"] = _res

# 2. Patch pydantic v1 field type inference for Python 3.14
#    Python 3.14 removed typing internals that pydantic v1 relies on to infer
#    Optional types. This causes ChromaDB Settings class definition to fail.
try:
    import pydantic.v1.fields as _pf

    _orig_set_default = _pf.ModelField._set_default_and_type

    def _patched_set_default_and_type(self):
        try:
            _orig_set_default(self)
        except Exception:
            if self.default is None:
                self.outer_type_ = typing.Optional[str]
                self.type_ = str
                self.required = False
                self.allow_none = True
                self.field_info.default = None
            else:
                self.outer_type_ = type(self.default)
                self.type_ = type(self.default)
                self.required = False

    _pf.ModelField._set_default_and_type = _patched_set_default_and_type
except Exception:
    pass

# ======================================================================
# Normal imports (chromadb is safe to import now)
# ======================================================================
import chromadb  # noqa: E402
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings  # noqa: E402
from google import genai  # noqa: E402
from google.genai import types  # noqa: E402
from dotenv import load_dotenv  # noqa: E402

load_dotenv()

EMBEDDING_MODEL   = "gemini-embedding-001"
GENERATIVE_MODEL  = "gemini-2.5-flash"
COLLECTION_NAME   = "astu_knowledge"


class GeminiEmbedding(EmbeddingFunction):
    """Custom embedding function using google-genai SDK directly."""

    def __init__(self, api_key: str, model: str = EMBEDDING_MODEL):
        self._client = genai.Client(api_key=api_key)
        self._model = model

    def __call__(self, input: Documents) -> Embeddings:
        results = []
        for text in input:
            resp = self._client.models.embed_content(
                model=self._model,
                contents=text,
            )
            results.append(resp.embeddings[0].values)
        return results


class RAGEngine:
    def __init__(self):
        self.ready = False
        api_key = os.environ.get("GEMINI_API_KEY", "")

        if not api_key or api_key == "your_gemini_api_key_here":
            print("⚠️  GEMINI_API_KEY is not set — RAG will not function.")
            return

        try:
            self.gen_client = genai.Client(api_key=api_key)
            self.chroma_client = chromadb.Client()
            self.embed_fn = GeminiEmbedding(api_key=api_key, model=EMBEDDING_MODEL)

            self.collection = self.chroma_client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=self.embed_fn,
            )

            self.ready = True
            doc_count = self.collection.count()
            print(f"✅ RAG Engine ready — {doc_count} chunks in vector store.")
        except Exception as e:
            print(f"❌ RAGEngine init failed: {e}")

    def ingest(self, text: str, source: str, chunk_index: int = 0) -> dict:
        if not self.ready:
            return {"error": "RAG engine not initialized"}
        doc_id = f"{source}__chunk_{chunk_index}"
        try:
            self.collection.upsert(
                ids=[doc_id],
                documents=[text],
                metadatas=[{"source": source, "chunk_index": chunk_index}],
            )
            return {"status": "ok", "id": doc_id}
        except Exception as e:
            print(f"[RAG] Ingest error: {e}")
            return {"error": str(e)}

    def query_stream(self, query: str, history: list = None):
        if not self.ready:
            yield "data: [ERROR] RAG engine not initialized.\n\n"
            yield "data: [DONE]\n\n"
            return

        history = history or []

        try:
            doc_count = self.collection.count()
            if doc_count > 0:
                results = self.collection.query(
                    query_texts=[query],
                    n_results=min(3, doc_count),
                )
                context_docs = results["documents"][0] if results["documents"] else []
                context = "\n\n---\n\n".join(context_docs)
            else:
                context = ""
        except Exception as e:
            print(f"[RAG] Retrieval error: {e}")
            context = ""

        history_text = ""
        for msg in history[-5:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

        system_instruction = (
            "You are a helpful assistant for the ASTU Smart Complaint & Issue Tracking System. "
            "Answer questions about campus policies, complaint procedures, and the system itself. "
            "Use the provided context when relevant. If the context does not contain the answer, "
            "use your general knowledge. Be concise and professional."
        )

        prompt_parts = []
        if context:
            prompt_parts.append(f"RELEVANT CONTEXT:\n{context}")
        if history_text:
            prompt_parts.append(f"CONVERSATION HISTORY:\n{history_text.strip()}")
        prompt_parts.append(f"USER QUESTION:\n{query}")

        prompt = "\n\n".join(prompt_parts)

        try:
            stream = self.gen_client.models.generate_content_stream(
                model=GENERATIVE_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3,
                ),
            )

            for chunk in stream:
                if chunk.text:
                    token = chunk.text.replace("\n", " ")
                    yield f"data: {token}\n\n"

            yield "data: [DONE]\n\n"

        except Exception as e:
            print(f"[RAG] Generation error: {e}")
            yield f"data: [ERROR] {str(e)}\n\n"
            yield "data: [DONE]\n\n"

    def reset(self) -> dict:
        if not self.ready:
            return {"error": "RAG engine not initialized"}
        try:
            self.chroma_client.delete_collection(COLLECTION_NAME)
            self.collection = self.chroma_client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=self.embed_fn,
            )
            print("✅ ChromaDB collection reset.")
            return {"status": "reset"}
        except Exception as e:
            print(f"[RAG] Reset error: {e}")
            return {"error": str(e)}

    def status(self) -> dict:
        if not self.ready:
            return {"status": "not_initialized", "chunks": 0}
        return {
            "status": "ready",
            "chunks": self.collection.count(),
            "collection": COLLECTION_NAME,
        }


# Singleton
rag_engine = RAGEngine()
