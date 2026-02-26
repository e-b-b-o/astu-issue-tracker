import React from 'react';
import { PackageOpen } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
  title = 'No Data Found', 
  message = 'There is currently no data to display here.',
  icon: Icon = PackageOpen,
  action 
}) => {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
