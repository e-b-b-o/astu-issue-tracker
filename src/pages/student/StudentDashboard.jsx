import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Activity, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ComplaintForm from '../../components/complaint/ComplaintForm';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import ComplaintTable from '../../components/complaint/ComplaintTable';
import EmptyState from '../../components/common/EmptyState';
import SearchFilter from '../../components/common/SearchFilter';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { STATUSES } from '../../utils/constants';
import './StudentDashboard.css';

const MOCK_COMPLAINTS = [
  { id: 'c1', title: 'Wifi down in Block 45', category: 'HOSTEL', status: STATUSES.OPEN, createdAt: new Date().toISOString() },
  { id: 'c2', title: 'Grade not updated for CS301', category: 'ACADEMIC', status: STATUSES.IN_PROGRESS, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'c3', title: 'Broken chair in library', category: 'MAINTENANCE', status: STATUSES.RESOLVED, createdAt: new Date(Date.now() - 172800000).toISOString() }
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useUI();
  
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    // Simulate initial fetch
    const fetchComplaints = () => {
      setTimeout(() => {
        setComplaints(MOCK_COMPLAINTS);
        setIsLoading(false);
      }, 1000);
    };
    fetchComplaints();
  }, []);

  const handleNewComplaint = (formData) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newComplaint = {
        id: `c${Date.now()}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        status: STATUSES.OPEN,
        createdAt: new Date().toISOString(),
        file: formData.file ? formData.file.name : null
      };
      
      setComplaints(prev => [newComplaint, ...prev]);
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      addToast('Complaint submitted successfully', 'success');
    }, 1500);
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
  const totalCount = complaints.length;
  const openCount = complaints.filter(c => c.status === STATUSES.OPEN).length;
  const resolvedCount = complaints.filter(c => c.status === STATUSES.RESOLVED).length;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="subtitle">Here is an overview of your complaints.</p>
        </div>
        <Button variant="primary" onClick={() => setIsSubmitModalOpen(true)}>
          <PlusCircle size={18} style={{ marginRight: '8px' }} />
          New Complaint
        </Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Filed</h3>
            <p className="stat-value">{isLoading ? '-' : totalCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <h3>Open Issues</h3>
            <p className="stat-value">{isLoading ? '-' : openCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Resolved</h3>
            <p className="stat-value">{isLoading ? '-' : resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Complaints</h2>
        
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
            title="No complaints found"
            message={searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "You haven't submitted any complaints yet."}
            actionLabel={!searchQuery && statusFilter === 'ALL' && categoryFilter === 'ALL' ? "Submit your first complaint" : "Clear Filters"}
            onAction={!searchQuery && statusFilter === 'ALL' && categoryFilter === 'ALL' 
              ? () => setIsSubmitModalOpen(true) 
              : () => { setSearchQuery(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
          />
        ) : (
          <>
            <div className="desktop-view">
              <ComplaintTable 
                complaints={filteredComplaints} 
                onViewDetails={(c) => setSelectedComplaint(c)} 
              />
            </div>
            <div className="mobile-view">
              <div className="complaint-cards-grid">
                {filteredComplaints.map(c => (
                  <ComplaintCard key={c.id} complaint={c} onClick={setSelectedComplaint} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Submit Modal */}
      <Modal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit New Complaint"
      >
        <ComplaintForm onSubmit={handleNewComplaint} isLoading={isSubmitting} />
      </Modal>

      {/* Details Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Ticket Details: #${selectedComplaint.id.slice(0, 8)}`}
        >
          <div className="complaint-details">
            <h3 className="details-title">{selectedComplaint.title}</h3>
            <p className="details-meta">
              <strong>Category:</strong> {selectedComplaint.category} | 
              <strong> Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleDateString()}
            </p>
            <div className="details-status">
              <strong>Status:</strong> <span className={`status-text ${selectedComplaint.status.toLowerCase()}`}>{selectedComplaint.status}</span>
            </div>
            <div className="details-desc">
              <strong>Description:</strong>
              <p>{selectedComplaint.description || "No detailed description provided."}</p>
            </div>
            {selectedComplaint.file && (
              <div className="details-attachment">
                <strong>Attachment:</strong> {selectedComplaint.file}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;
