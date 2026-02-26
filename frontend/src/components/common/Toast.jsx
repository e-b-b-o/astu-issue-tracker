import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import './Toast.css';

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

const Toast = () => {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type} fade-in-up`}>
          <span className="toast-icon">{ICONS[t.type] || ICONS.info}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
