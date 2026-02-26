import React from 'react';
import { STATUSES } from '../../utils/constants';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case STATUSES.OPEN:
        return 'badge-warning';
      case STATUSES.IN_PROGRESS:
        return 'badge-primary';
      case STATUSES.RESOLVED:
        return 'badge-success';
      default:
        return 'badge-default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case STATUSES.OPEN: return 'Open';
      case STATUSES.IN_PROGRESS: return 'In Progress';
      case STATUSES.RESOLVED: return 'Resolved';
      default: return status || 'Unknown';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
