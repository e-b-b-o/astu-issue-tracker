import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-backdrop" onClick={onClose} />
      <div className="notification-dropdown slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-header">
          <h3>Notifications</h3>
          {notifications.length > 0 && (
            <button className="clear-all-btn" onClick={clearAll} title="Clear All">
              <Trash2 size={16} />
            </button>
          )}
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
                <li key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                  <div className={`notification-dot ${notif.type}`}></div>
                  <div className="notification-content">
                    <p>{notif.message}</p>
                    <span className="notification-time">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!notif.read && (
                    <button className="mark-read-btn" onClick={() => markAsRead(notif.id)} title="Mark as read">
                      <Check size={16} />
                    </button>
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
