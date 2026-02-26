import React, { useState } from 'react';
import { Send, Bot, User, Loader2, Minimize2, Maximize2, X } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am the ASTU Support Bot. How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      const botMsg = { 
        id: (Date.now() + 1).toString(), 
        text: 'I understand. I am a demo bot, but I will be connected to the backend soon to assist you fully with that query.', 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button className="chatbot-toggle-btn bounce" onClick={toggleOpen} aria-label="Open Chatbot">
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className={`chatbot-window ${isMinimized ? 'minimized' : ''} slide-up`}>
      <div className="chatbot-header">
        <div className="chatbot-title">
          <Bot size={20} className="chatbot-icon" />
          <span>Support Bot</span>
        </div>
        <div className="chatbot-actions">
          <button onClick={() => setIsMinimized(!isMinimized)} aria-label="Minimize">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender === 'bot' ? 'bot-bubble' : 'user-bubble'} fade-in`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble bot-bubble fade-in">
                <div className="message-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim() || isTyping}>
              {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot;
