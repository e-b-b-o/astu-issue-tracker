import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useUI();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        
        <div className="navbar-left">
          {user && (
            <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
              <Menu size={24} />
            </button>
          )}
          <NavLink to="/" className="navbar-brand">
            <span className="brand-highlight">ASTU</span> Tracker
          </NavLink>
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <div className="nav-item notification-wrapper">
                <button 
                  className="icon-button" 
                  aria-label="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
              
              <div className="nav-item user-profile">
                <NavLink to="/dashboard/profile" className="profile-link">
                  <UserCircle size={24} />
                  <span className="user-name hidden-mobile">{user.name}</span>
                </NavLink>
              </div>
              
              <button className="icon-button text-error" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <div className="nav-actions">
              <NavLink to="/login" className="nav-link">Log In</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;
