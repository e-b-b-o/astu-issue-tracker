import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import ComplaintTable from '../../components/complaint/ComplaintTable';
import EmptyState from '../../components/common/EmptyState';
import SearchFilter from '../../components/common/SearchFilter';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { STATUSES, isValidTransition, getNextValidStatuses } from '../../utils/constants';
import './StaffDashboard.css';

const MOCK_ASSIGNED_COMPLAINTS = [
  { id: 'c1', title: 'Wifi down in Block 45', category: 'HOSTEL', status: STATUSES.OPEN, description: 'No internet connection for 2 days.', createdAt: new Date().toISOString() },
  { id: 'c3', title: 'Broken chair in library', category: 'MAINTENANCE', status: STATUSES.IN_PROGRESS, description: 'Chair leg is completely detached near row A.', createdAt: new Date(Date.now() - 172800000).toISOString() }
];

const StaffDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useUI();
  
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Status Update State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setComplaints(MOCK_ASSIGNED_COMPLAINTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemarks('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (newStatus === selectedComplaint.status) {
      addToast('Status is already set to ' + newStatus, 'warning');
      return;
    }
    if (!isValidTransition(selectedComplaint.status, newStatus)) {
      addToast('Invalid status transition', 'error');
      return;
    }

    setIsUpdating(true);
    
    // Simulate API Call
    setTimeout(() => {
      setComplaints(prev => prev.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
      ));
      setIsUpdating(false);
      setIsUpdateModalOpen(false);
      setSelectedComplaint(null);
      addToast('Complaint status updated successfully', 'success');
    }, 1000);
  };

  const getFilteredComplaints = () => {
    let filtered = complaints;

    if (searchQuery) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredComplaints = getFilteredComplaints();
  
  // Stats
  const openCount = complaints.filter(c => c.status === STATUSES.OPEN).length;
  const inProgressCount = complaints.filter(c => c.status === STATUSES.IN_PROGRESS).length;
  const resolvedCount = complaints.filter(c => c.status === STATUSES.RESOLVED).length;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Staff Dashboard</h1>
          <p className="subtitle">Manage and resolve assigned complaints.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper text-error" style={{ backgroundColor: 'var(--error-bg)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <h3>New / Open</h3>
            <p className="stat-value">{isLoading ? '-' : openCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper text-warning" style={{ backgroundColor: 'var(--warning-bg)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p className="stat-value">{isLoading ? '-' : inProgressCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper text-success" style={{ backgroundColor: 'var(--success-bg)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Resolved</h3>
            <p className="stat-value">{isLoading ? '-' : resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Assigned Tickets</h2>
        
        <SearchFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {isLoading ? (
          <div className="skeleton-loader h-64"></div>
        ) : filteredComplaints.length === 0 ? (
          <EmptyState 
            title="No tickets found"
            message="No tickets match your current filters or none are assigned to you."
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
          />
        ) : (
          <>
            <div className="desktop-view">
              <ComplaintTable 
                complaints={filteredComplaints} 
                onViewDetails={openUpdateModal} 
              />
            </div>
            <div className="mobile-view">
              <div className="complaint-cards-grid">
                {filteredComplaints.map(c => (
                  <ComplaintCard key={c.id} complaint={c} onClick={openUpdateModal} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Update Status Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Ticket: #${selectedComplaint.id.slice(0, 8)}`}
        >
          <div className="staff-action-container">
            <div className="ticket-summary">
              <h4>{selectedComplaint.title}</h4>
              <p>{selectedComplaint.description}</p>
              <div className="current-status-badge mt-2">
                Current Status: <span className={`status-text ${selectedComplaint.status.toLowerCase()}`}>{selectedComplaint.status}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="update-status-form mt-4">
              <div className="input-group">
                <label className="input-label">Update Status To</label>
                <select 
                  className="input-field" 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={selectedComplaint.status === STATUSES.RESOLVED}
                >
                  <option value={selectedComplaint.status} disabled>Select new status</option>
                  {getNextValidStatuses(selectedComplaint.status).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {selectedComplaint.status === STATUSES.RESOLVED && (
                  <p className="text-secondary text-sm mt-1">This ticket is already resolved and cannot be changed.</p>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Add Remarks (Optional)</label>
                <textarea 
                  className="input-field textarea-field" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="E.g., Waiting on parts, or issue fixed."
                  rows={3}
                  disabled={selectedComplaint.status === STATUSES.RESOLVED}
                />
              </div>

              <div className="form-actions mt-4 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isUpdating || newStatus === selectedComplaint.status || selectedComplaint.status === STATUSES.RESOLVED}
                >
                  {isUpdating ? 'Saving...' : 'Update Ticket'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffDashboard;
