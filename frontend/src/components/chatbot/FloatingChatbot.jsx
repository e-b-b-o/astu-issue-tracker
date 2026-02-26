import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Overlay */}
      {open && (
        <div className="floating-chat-overlay fade-in">
          <div className="floating-chat-panel fade-in-up">
            <ChatWindow />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className={`floating-chat-btn ${open ? 'floating-chat-btn--active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open AI assistant'}
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </>
  );
};

export default FloatingChatbot;
