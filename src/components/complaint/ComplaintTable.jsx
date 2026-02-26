import React from 'react';
import StatusBadge from '../ui/StatusBadge';
import { Eye, Clock } from 'lucide-react';
import './ComplaintTable.css';

const ComplaintTable = ({ complaints, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!complaints || complaints.length === 0) {
    return null; // Should be handled by EmptyState in parent
  }

  return (
    <div className="table-container fade-in">
      <table className="complaint-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date Selected</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="table-row">
              <td className="col-id">#{complaint.id?.slice(0, 8)}</td>
              <td className="col-title">
                <div className="title-cell" title={complaint.title}>
                  {complaint.title}
                </div>
              </td>
              <td>{complaint.category}</td>
              <td className="col-date">
                <div className="date-cell">
                  <Clock size={14} className="date-icon" />
                  {formatDate(complaint.createdAt)}
                </div>
              </td>
              <td>
                <StatusBadge status={complaint.status} />
              </td>
              <td className="col-actions">
                <button 
                  className="action-btn"
                  onClick={() => onViewDetails && onViewDetails(complaint)}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
