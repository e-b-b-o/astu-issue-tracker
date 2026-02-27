import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import '../student/StudentDashboard.css';

const CATEGORIES = ['All Categories', 'Academic', 'Facilities', 'Administration', 'IT/Tech', 'Other'];

const StaffDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [previewImage, setPreviewImage] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch {
      addToast('Failed to load complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      addToast(`Status updated to ${status}`, 'success');
      fetchComplaints();
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const addRemark = async (id) => {
    if (!remarkText.trim()) return;
    try {
      await api.post(`/complaints/${id}/remarks`, { text: remarkText });
      addToast('Remark added', 'success');
      setRemarkText('');
      fetchComplaints();
    } catch {
      addToast('Failed to add remark', 'error');
    }
  };

  const getImageUrl = (image, imageType) => {
    if (!image) return null;
    return `data:${imageType || 'image/jpeg'};base64,${image}`;
  };

  const filteredComplaints = complaints.filter(c => 
    categoryFilter === 'All Categories' || c.category === categoryFilter
  );

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'Open').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="student-dash fade-in-up">
      <div className="dash-topbar">
        <div>
          <p className="dash-eyebrow">STAFF PORTAL</p>
          <h1 className="dash-title">Welcome, {user?.username}</h1>
        </div>
        <div className="dash-tabs">
          {[['all', 'All Issues']].map(([k, l]) => (
            <button key={k} className={`dash-tab ${tab === k ? 'dash-tab--active' : ''}`}
              onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tab-content fade-in">
        {tab === 'all' && (
          <>
            <div className="dash-stats">
              <div className="stat-card">
                <p className="stat-label">Total</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Open</p>
                <p className="stat-value">{stats.open}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">In Progress</p>
                <p className="stat-value">{stats.inProgress}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Resolved</p>
                <p className="stat-value">{stats.resolved}</p>
              </div>
            </div>

            <div className="dash-section">
              <div className="dash-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="dash-section-label">ALL COMPLAINTS</span>
                <div className="filter-group" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>Filter:</span>
                  <select 
                    className="form-input" 
                    style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="dash-loading"><div className="spinner" /></div>
              ) : filteredComplaints.length === 0 ? (
                <div className="dash-empty">No complaints found for this category.</div>
              ) : (
                <div className="complaint-list">
                  {filteredComplaints.map((c) => (
                    <div key={c._id} className="complaint-card"
                      onClick={() => setSelected(selected?._id === c._id ? null : c)}>
                      <div className="complaint-card-top">
                        <span className="complaint-title">{c.title}</span>
                        <Badge label={c.status} />
                      </div>
                      <div className="complaint-card-meta">
                        <span className="meta-tag">{c.category}</span>
                        <span>{c.createdBy?.username || 'Unknown'}</span>
                        <span className="meta-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      {selected?._id === c._id && (
                        <div className="complaint-detail fade-in">
                          <p className="complaint-desc">{c.description}</p>
                          
                          {c.image && (
                            <div className="complaint-image-box" style={{ marginTop: 15 }}>
                              <p className="remarks-label">ATTACHED IMAGE</p>
                              <img 
                                src={getImageUrl(c.image, c.imageType)} 
                                alt="Complaint" 
                                style={{ maxWidth: '200px', borderRadius: '8px', cursor: 'zoom-in', border: '1px solid rgba(255,255,255,0.1)' }}
                                onClick={(e) => { e.stopPropagation(); setPreviewImage(getImageUrl(c.image, c.imageType)); }}
                              />
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                            {['Open', 'In Progress', 'Resolved'].map((s) => (
                              <Button key={s} size="sm"
                                variant={c.status === s ? 'primary' : 'secondary'}
                                onClick={(e) => { e.stopPropagation(); updateStatus(c._id, s); }}>
                                {s}
                              </Button>
                            ))}
                          </div>
                          {c.remarks?.length > 0 && (
                            <div className="remarks" style={{ marginTop: 14 }}>
                              <p className="remarks-label">REMARKS</p>
                              {c.remarks.map((r, i) => (
                                <div key={i} className="remark-item">
                                  <span className="remark-author">{r.addedBy?.username || 'Staff'}</span>
                                  <span className="remark-text">{r.text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                            <input className="form-input" style={{ flex: 1 }}
                              placeholder="Add a remark..."
                              value={selected._id === c._id ? remarkText : ''}
                              onChange={(e) => setRemarkText(e.target.value)}
                              onClick={(e) => e.stopPropagation()} />
                            <Button size="sm" variant="primary"
                              onClick={(e) => { e.stopPropagation(); addRemark(c._id); }}>
                              Add
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {previewImage && (
        <div 
          className="modal-overlay fade-in" 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px' }} />
          <button style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: 'none', color: '#fff', fontSize: '32px', cursor: 'pointer' }}>&times;</button>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
