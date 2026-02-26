import React, { useState, useEffect } from 'react';
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
  const [tab, setTab] = useState('overview');
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
          {[['overview','Overview'],['complaints','Complaints'],['users','Users'],['documents','Documents']].map(([k,l]) => (
            <button key={k} className={`dash-tab ${tab===k?'dash-tab--active':''}`}
              onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && analytics && (
        <>
          <div className="dash-stats">
            <div className="stat-card"><p className="stat-label">Total Issues</p><p className="stat-value">{analytics.total}</p></div>
            <div className="stat-card"><p className="stat-label">Open</p><p className="stat-value">{analytics.open}</p></div>
            <div className="stat-card"><p className="stat-label">In Progress</p><p className="stat-value">{analytics.inProgress}</p></div>
            <div className="stat-card"><p className="stat-label">Resolved</p><p className="stat-value">{analytics.resolved}</p></div>
            <div className="stat-card"><p className="stat-label">Total Users</p><p className="stat-value">{analytics.userCount}</p></div>
            <div className="stat-card"><p className="stat-label">Resolution Rate</p><p className="stat-value">{analytics.resolutionRate}%</p></div>
          </div>
          <div className="dash-section" style={{ marginTop: 24 }}>
            <div className="dash-section-header"><span className="dash-section-label">TOP CATEGORY</span></div>
            <div className="admin-top-category">{analytics.topCategory}</div>
          </div>
          {analytics.byCategory?.length > 0 && (
            <div className="dash-section">
              <div className="dash-section-header"><span className="dash-section-label">BY CATEGORY</span></div>
              <div className="admin-cat-grid">
                {analytics.byCategory.map((c) => (
                  <div key={c._id} className="admin-cat-item">
                    <span className="admin-cat-name">{c._id}</span>
                    <span className="admin-cat-count">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
          <div className="admin-users-table">
            <div className="admin-table-head admin-table-5col">
              <span>NAME</span><span>EMAIL</span><span>ROLE</span><span>CHANGE ROLE</span><span>ACTION</span>
            </div>
            {users.map((u) => (
              <div key={u._id} className="admin-table-row admin-table-5col">
                <span>{u.username}</span>
                <span className="truncate">{u.email}</span>
                <span><Badge label={u.role} type="role" /></span>
                <span>
                  <select className="form-input" value={u.role} style={{ padding: '4px 8px', fontSize: 11 }}
                    onChange={(e) => updateRole(u._id, e.target.value)}>
                    <option value="student">student</option>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                </span>
                <span>
                  {u._id !== user?._id && (
                    <button className="admin-delete-btn" onClick={() => deleteUserById(u._id)}
                      title="Delete user"><Trash2 size={14} /></button>
                  )}
                </span>
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
            <div className="dash-empty">No documents ingested yet. Upload ASTU policy docs to power the AI assistant.</div>
          ) : (
            <div className="admin-users-table">
              <div className="admin-table-head admin-table-doc"><span>NAME</span><span>TYPE</span><span>STATUS</span><span>CHUNKS</span><span>DATE</span></div>
              {documents.map((d) => (
                <div key={d._id} className="admin-table-row admin-table-doc">
                  <span className="truncate">{d.originalName}</span>
                  <span>{d.type}</span>
                  <span><Badge label={d.status === 'ingested' ? 'Resolved' : d.status === 'pending' ? 'Open' : 'In Progress'} /></span>
                  <span>{d.chunkCount}</span>
                  <span className="meta-date">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
