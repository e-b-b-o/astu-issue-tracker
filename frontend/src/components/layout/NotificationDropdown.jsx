import React from 'react';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAsRead } = useNotification();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markAsRead(notif._id);
    }
    onClose();
    // Redirect to the complaint
    navigate('/dashboard'); // For simplicity, though specific routing could be added
  };

  return (
    <>
      <div className="notification-backdrop" onClick={onClose} />
      <div className="notification-dropdown slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-header">
          <h3>Notifications</h3>
        </div>
        
        <div className="dropdown-body">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Bell size={32} className="empty-icon" />
              <p>No new notifications</p>
            </div>
          ) : (
            <ul className="notification-list">
              {notifications.map((notif) => (
                <li 
                  key={notif._id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`notification-dot ${notif.read ? '' : 'unread'}`}></div>
                  <div className="notification-content">
                    <p>{notif.message}</p>
                    <span className="notification-time">
                      {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!notif.read && (
                    <div className="mark-unread-indicator"></div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
