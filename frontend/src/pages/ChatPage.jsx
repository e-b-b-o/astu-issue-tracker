import React from 'react';
import ChatWindow from '../components/chatbot/ChatWindow';
import '../pages/student/StudentDashboard.css';

const ChatPage = () => (
  <div className="fade-in-up">
    <p className="dash-eyebrow">SUPPORT</p>
    <h1 className="dash-title" style={{ marginBottom: 24 }}>AI Assistant</h1>
    <ChatWindow />
  </div>
);

export default ChatPage;
