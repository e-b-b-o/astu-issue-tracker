import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import './ComplaintCard.css';

const ComplaintCard = ({ complaint, onClick }) => {
  const { title, category, status, createdAt, id } = complaint;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="complaint-card" onClick={() => onClick && onClick(complaint)}>
      <div className="card-header">
        <span className="card-id">#{id?.slice(0, 8)}</span>
        <StatusBadge status={status} />
      </div>
      
      <h3 className="card-title">{title}</h3>
      
      <div className="card-meta">
        <div className="meta-item">
          <Tag size={14} />
          <span>{category}</span>
        </div>
        <div className="meta-item">
          <Calendar size={14} />
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
