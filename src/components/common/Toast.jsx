import React from 'react';
import { useUI } from '../../context/UIContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const ToastManager = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} slide-up`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'warning' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <div className="toast-content">
            <p>{toast.message}</p>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastManager;
