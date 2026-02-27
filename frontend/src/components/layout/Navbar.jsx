import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Menu, X, Bell } from 'lucide-react';
import Button from '../ui/Button';
import NotificationDropdown from './NotificationDropdown';
import { useNotification } from '../../context/NotificationContext';
import './Navbar.css';

const Navbar = ({ dashboard = false }) => {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUI();
  const { notifications } = useNotification();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-left">
          {dashboard && (
            <button className="navbar-hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-mark">■</span>
            <span className="navbar-logo-text">ASTU ISSUE TRACKER</span>
          </Link>
        </div>

        <div className="navbar-right" style={{ position: 'relative' }}>
          {user ? (
            <>
              <div 
                className="navbar-notification-btn" 
                onClick={() => setShowNotifications(!showNotifications)} 
                style={{ cursor: 'pointer', marginRight: 15, position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge" style={{ position: 'absolute', top: -5, right: -5, background: 'var(--primary-color)', color: '#000', fontSize: 10, fontWeight: 'bold', width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="navbar-user">
                {user.username} <span className="navbar-role">/ {user.role}</span>
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
              <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            </>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
