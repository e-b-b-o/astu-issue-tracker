import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Send, Trash2, Bot, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../ui/Button';
import './ChatWindow.css';

const getChatBotAPI = () => {
  let url = import.meta.env.VITE_API_URL || '';
  if (!url) return 'http://localhost:5000/api';
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  return url;
};
const API_BASE = getChatBotAPI();

const ChatWindow = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [streaming, setStreaming] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load chat history on mount — only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/chat/history').then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data.map((m) => ({ role: m.role, content: m.content })));
      }
    }).catch(() => {});
  }, [isAuthenticated]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearHistory = async () => {
    if (!isAuthenticated) return;
    await api.delete('/chat/history').catch(() => {});
    setMessages([]);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    // AUTH GUARD: if not logged in, do NOT call backend
    if (!isAuthenticated) {
      setAuthWarning(true);
      return;
    }

    setAuthWarning(false);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setStreaming(true);

    // Add empty assistant bubble to stream into
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      // Read SSE stream via ReadableStream
      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process all complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const tkn = line.slice(6);
            if (tkn === '[DONE]') break;
            if (tkn.startsWith('[ERROR]')) {
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: tkn.replace('[ERROR] ', '') };
                return copy;
              });
              break;
            }
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, content: last.content + tkn };
              return copy;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, streaming, isAuthenticated]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <Bot size={16} />
          <span>AI ASSISTANT</span>
        </div>
        {isAuthenticated && (
          <button className="chat-clear-btn" onClick={clearHistory} title="Clear history">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <Bot size={32} className="chat-empty-icon" />
            <p>Ask anything about campus policies, complaint procedures, or how to use the system.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${msg.role} fade-in-up`}>
            <div className="chat-bubble-icon">
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div className="chat-bubble-content">
              {msg.content}
              {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                <span className="chat-cursor" aria-hidden="true">▋</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Auth warning — shown when unauthenticated user tries to send */}
      {authWarning && !isAuthenticated && (
        <div className="chat-auth-warning fade-in-up">
          <Lock size={14} />
          <span>To use the AI assistant, you must first log in.</span>
          <Link to="/login">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder={isAuthenticated ? 'Ask a question…' : 'Sign in to use the AI assistant…'}
          value={input}
          onChange={(e) => { setInput(e.target.value); setAuthWarning(false); }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={streaming}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
          aria-label="Send message"
        >
          {streaming ? (
            <span className="chat-send-spinner" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
