import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import '../student/StudentDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const location = useLocation();

  const getInitialTab = () => {
    const path = location.pathname.split('/').pop();
    if (['complaints', 'users', 'documents', 'analytics'].includes(path)) {
      return path;
    }
    return 'overview';
  };

  const [tab, setTab] = useState(getInitialTab());

  // Sync tab state with URL navigation
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['complaints', 'users', 'documents', 'analytics'].includes(path)) {
      setTab(path);
    } else if (path === 'admin') {
      setTab('overview');
    }
  }, [location.pathname]);

  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aRes, cRes, uRes, dRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/complaints'),
        api.get('/admin/users'),
        api.get('/admin/documents'),
      ]);
      setAnalytics(aRes.data);
      setComplaints(cRes.data);
      setUsers(uRes.data);
      setDocuments(dRes.data);
    } catch {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      addToast(`Status updated to ${status}`, 'success');
      fetchAll();
    } catch { addToast('Failed to update status', 'error'); }
  };

  const addRemark = async (id) => {
    if (!remarkText.trim()) return;
    try {
      await api.post(`/complaints/${id}/remarks`, { text: remarkText });
      addToast('Remark added', 'success');
      setRemarkText('');
      fetchAll();
    } catch { addToast('Failed to add remark', 'error'); }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      addToast(`Role updated to ${role}`, 'success');
      fetchAll();
    } catch { addToast('Failed to update role', 'error'); }
  };

  const deleteUserById = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      addToast('User deleted', 'success');
      fetchAll();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      await api.post('/admin/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addToast('Document ingested successfully', 'success');
      fetchAll();
    } catch (err) {
      addToast(err.response?.data?.message || 'Ingestion failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetRag = async () => {
    if (!confirm('Reset all RAG data? This cannot be undone.')) return;
    try {
      await api.post('/admin/reset-rag');
      addToast('RAG data reset', 'success');
      fetchAll();
    } catch { addToast('Failed to reset RAG', 'error'); }
  };

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;

  return (
    <div className="student-dash fade-in-up">
      <div className="dash-topbar">
        <div>
          <p className="dash-eyebrow">ADMIN PORTAL</p>
          <h1 className="dash-title">Admin Dashboard</h1>
        </div>
        <div className="dash-tabs">
          {[
            ['overview','Overview'],
            ['analytics', 'Analytics'],
            ['complaints','Complaints'],
            ['users','Users'],
            ['documents','Documents']
          ].map(([k,l]) => (
            <button key={k} className={`dash-tab ${tab===k?'dash-tab--active':''}`}
              onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tab-content fade-in" key={tab}>
        {/* OVERVIEW */}
        {tab === 'overview' && analytics && (
          <>
            <div className="dash-stats">
              <div className="stat-card"><p className="stat-label">Total Issues</p><p className="stat-value">{analytics.total}</p></div>
              <div className="stat-card"><p className="stat-label">Open</p><p className="stat-value">{analytics.open}</p></div>
              <div className="stat-card"><p className="stat-label">In Progress</p><p className="stat-value">{analytics.inProgress}</p></div>
              <div className="stat-card"><p className="stat-label">Resolved</p><p className="stat-value">{analytics.resolved}</p></div>
            </div>
            <div className="dash-section" style={{ marginTop: 24 }}>
              <div className="dash-section-header"><span className="dash-section-label">TOP CATEGORY</span></div>
              <div className="admin-top-category">{analytics.topCategory}</div>
            </div>
          </>
        )}

        {/* ANALYTICS VISUALIZATION */}
        {tab === 'analytics' && analytics && (
          <div className="dash-section">
            <div className="dash-section-header"><span className="dash-section-label">PERFORMANCE ANALYTICS</span></div>
            
            <div className="dash-stats">
              <div className="stat-card">
                <p className="stat-label">Resolution Rate</p>
                <p className="stat-value">{analytics.resolutionRate}%</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{analytics.userCount}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
              <div className="dash-empty" style={{ padding: '24px', textAlign: 'left' }}>
                <p className="dash-section-label" style={{ marginBottom: '16px' }}>ISSUES BY CATEGORY</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analytics.byCategory?.map(c => {
                    const percent = Math.round((c.count / analytics.total) * 100);
                    return (
                      <div key={c._id} style={{ fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{c._id}</span>
                          <span>{c.count}</span>
                        </div>
                        <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${percent}%`, 
                            background: 'var(--primary-color)', 
                            borderRadius: '3px',
                            transition: 'width 1s ease-out'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dash-empty" style={{ padding: '24px', textAlign: 'left' }}>
                <p className="dash-section-label" style={{ marginBottom: '16px' }}>RESOLUTION PROGRESS</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="var(--primary-color)" strokeWidth="3"
                          strokeDasharray={`${analytics.resolutionRate}, 100`} />
                      </svg>
                      <div style={{ 
                        position: 'absolute', inset: 0, display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', 
                        fontSize: '18px', fontWeight: '700' 
                      }}>
                        {analytics.resolutionRate}%
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS */}
        {tab === 'complaints' && (
          <div className="dash-section">
            <div className="dash-section-header"><span className="dash-section-label">ALL COMPLAINTS &mdash; {complaints.length}</span></div>
            {complaints.length === 0 ? (
              <div className="dash-empty">No complaints yet.</div>
            ) : (
              <div className="complaint-list">
                {complaints.map((c) => (
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
                        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                          {['Open', 'In Progress', 'Resolved'].map((s) => (
                            <Button key={s} size="sm" variant={c.status === s ? 'primary' : 'secondary'}
                              onClick={(e) => { e.stopPropagation(); updateStatus(c._id, s); }}>{s}</Button>
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
                          <input className="form-input" style={{ flex: 1 }} placeholder="Add a remark..."
                            value={selected._id === c._id ? remarkText : ''}
                            onChange={(e) => setRemarkText(e.target.value)}
                            onClick={(e) => e.stopPropagation()} />
                          <Button size="sm" variant="primary"
                            onClick={(e) => { e.stopPropagation(); addRemark(c._id); }}>Add</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="dash-section">
            <div className="dash-section-header"><span className="dash-section-label">USERS &mdash; {users.length}</span></div>
            <div className="complaint-list">
              {users.map((u) => (
                <div key={u._id} className="complaint-card" style={{ cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p className="complaint-title">{u.username}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{u.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select
                        className="form-input"
                        value={u.role}
                        style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        disabled={u._id === user?._id}
                      >
                        <option value="student">student</option>
                        <option value="staff">staff</option>
                        <option value="admin">admin</option>
                      </select>
                      {u._id !== user?._id && (
                        <button className="btn--danger" style={{ padding: '6px', borderRadius: '4px' }}
                          onClick={() => deleteUserById(u._id)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {tab === 'documents' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-label">RAG DOCUMENTS &mdash; {documents.length}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <label className="btn btn--primary btn--sm" style={{ cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                  <input type="file" accept=".txt,.pdf" onChange={handleFileUpload}
                    style={{ display: 'none' }} disabled={uploading} />
                </label>
                <Button variant="danger" size="sm" onClick={resetRag}>Reset RAG</Button>
              </div>
            </div>
            {documents.length === 0 ? (
              <div className="dash-empty">No documents ingested yet.</div>
            ) : (
              <div className="complaint-list">
                {documents.map((d) => (
                  <div key={d._id} className="complaint-card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p className="complaint-title">{d.originalName}</p>
                        <div className="complaint-card-meta" style={{ marginTop: '4px' }}>
                          <span className="meta-tag">{d.type}</span>
                          <span>{d.chunkCount} chunks</span>
                        </div>
                      </div>
                      <Badge label={d.status === 'ingested' ? 'Resolved' : 'Open'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
