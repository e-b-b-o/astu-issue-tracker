import os
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
from rag_engine import rag_engine

load_dotenv()

app = Flask(__name__)

raw_origins = os.environ.get("FRONTEND_URL", "http://localhost:5173") + "," + os.environ.get("EXPRESS_URL", "http://localhost:5000")
# Normalize: split, trim, and remove trailing slashes for safer comparison
allowed_origins = [o.strip().rstrip("/") for o in raw_origins.split(",") if o.strip()]

print(f"[RAG] Allowed Origins: {allowed_origins}")
CORS(app, origins=allowed_origins)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ASTU RAG Service", **rag_engine.status()})


@app.route("/ingest", methods=["POST"])
def ingest():
    data = request.get_json(force=True)
    text        = data.get("text", "").strip()
    source      = data.get("source", "unknown")
    chunk_index = data.get("chunk_index", 0)

    if not text:
        return jsonify({"error": "text is required"}), 400

    result = rag_engine.ingest(text, source, chunk_index)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200


@app.route("/query", methods=["POST"])
def query():
    data    = request.get_json(force=True)
    q       = data.get("query", "").strip()
    history = data.get("history", [])

    if not q:
        return jsonify({"error": "query is required"}), 400

    def generate():
        yield from rag_engine.query_stream(q, history)

    return Response(
        stream_with_context(generate()),
        content_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.route("/reset", methods=["POST"])
def reset():
    result = rag_engine.reset()
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🚀 ASTU RAG Service starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
