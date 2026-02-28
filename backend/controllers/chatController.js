import Chat from '../models/Chat.js';



// @route   POST /api/chat/ask
// @access  Private
export const askQuestion = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // 1. Get or create chat session for user
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }

    // 2. Save user message
    chat.messages.push({ role: 'user', content: message });
    await chat.save();

    // 3. Build history: last 5 message pairs
    const history = chat.messages
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    // 4. Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 5. Proxy to Flask RAG service
    const rawUrl = process.env.RAG_SERVICE_URL || 'http://localhost:5001';
    // Remove trailing slashes to prevent //query issues
    const RAG_BASE = rawUrl.replace(/\/+$/, "");
    const targetUrl = `${RAG_BASE}/query`;
    const healthUrl = `${RAG_BASE}/health`;

    // —— WAKE-UP LOGIC (Render Free Tier Support) ——
    let isAwake = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s pre-flight check
      const ping = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      isAwake = ping.ok;
    } catch (e) {
      isAwake = false;
    }

    if (!isAwake) {
      console.log(`[Chat] RAG service appears to be asleep at ${RAG_BASE}. Triggering wake-up...`);
      // Start a "real" wake-up request in the background (no await)
      fetch(healthUrl).catch(() => {}); 
      
      res.write(`data: I’m waking up, please try again after 60 seconds.\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    let ragResponse;
    try {
      console.log(`[Chat] Proxying request to RAG: ${targetUrl}`);
      ragResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message, history }),
      });
      if (ragResponse.ok) {
        console.log(`[Chat] RAG service is awake and responding.`);
      }
    } catch (fetchError) {
      console.error('[Chat] RAG service unreachable:', fetchError.message);
      res.write(`data: [ERROR] AI service is currently unavailable or unreachable (${fetchError.message}).\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    if (!ragResponse.ok) {
      const errText = await ragResponse.text();
      console.error('[Chat] RAG error response:', errText);
      res.write(`data: [ERROR] AI service error.\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    // 6. Pipe SSE chunks from Flask to browser and collect full answer
    let fullAnswer = '';
    const reader = ragResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // Flask sends "data: <text>\n\n" — forward directly
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const token = line.slice(6);
          if (token !== '[DONE]') {
            fullAnswer += token;
          }
          res.write(`${line}\n`);
        }
      }
      res.write('\n');
    }

    res.write('data: [DONE]\n\n');
    res.end();

    // 7. Persist assistant response to MongoDB
    chat.messages.push({ role: 'assistant', content: fullAnswer });
    await chat.save();
  } catch (error) {
    console.error('[Chat] ask error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.write(`data: [ERROR] ${error.message}\n\n`);
      res.end();
    }
  }
};

// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error('[Chat] history error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/chat/history
// @access  Private
export const clearChatHistory = async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ user: req.user._id }, { messages: [] });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('[Chat] clear history error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
