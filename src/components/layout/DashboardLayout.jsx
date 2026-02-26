import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';
import { useUI } from '../../context/UIContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { isSidebarOpen } = useUI();

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar className={isSidebarOpen ? 'open' : ''} />
        <main className={`dashboard-main ${isSidebarOpen ? 'shifted' : ''}`}>
          <div className="dashboard-container">
            <Outlet />
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;
