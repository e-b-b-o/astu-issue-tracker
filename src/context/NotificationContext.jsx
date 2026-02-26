import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, read: false, createdAt: new Date() }]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
