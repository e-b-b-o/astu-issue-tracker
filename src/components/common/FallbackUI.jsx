import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import './EmptyState.css'; // Reusing empty state styles for layout consistency

const FallbackUI = ({ error, resetErrorBoundary }) => {
  return (
    <div className="empty-state fade-in" style={{ borderColor: 'var(--error-bg)' }}>
      <div className="empty-state-icon" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}>
        <AlertCircle size={48} />
      </div>
      <h3 className="empty-state-title">Something went wrong</h3>
      <p className="empty-state-message" style={{ color: 'var(--error)' }}>
        {error?.message || 'An unexpected error occurred while loading this section.'}
      </p>
      
      <div className="empty-state-action">
        <Button onClick={resetErrorBoundary} variant="secondary">
          <RefreshCw size={16} style={{ marginRight: '8px' }} />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default FallbackUI;
