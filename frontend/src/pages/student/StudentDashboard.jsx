import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ChatWindow from '../../components/chatbot/ChatWindow';
import './StudentDashboard.css';

const CATEGORIES = ['Academic', 'Facilities', 'Administration', 'IT/Tech', 'Other'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('complaints');
  const [form, setForm] = useState({ title: '', description: '', category: CATEGORIES[0] });
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { addToast('All fields required', 'error'); return; }
    setSubmitting(true);
    try {
      await api.post('/complaints', form);
      addToast('Complaint submitted', 'success');
      setForm({ title: '', description: '', category: CATEGORIES[0] });
      setTab('complaints');
      fetchComplaints();
    } catch (err) {
      addToast(err.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="student-dash fade-in-up">
      <div className="dash-topbar">
        <div>
          <p className="dash-eyebrow">STUDENT PORTAL</p>
          <h1 className="dash-title">Welcome, {user?.username}</h1>
        </div>
        <div className="dash-tabs">
          {[['complaints', 'My Issues'], ['new', 'New Issue'], ['chat', 'AI Chat']].map(([k, l]) => (
            <button key={k} className={`dash-tab ${tab === k ? 'dash-tab--active' : ''}`}
              onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'complaints' && (
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-label">YOUR COMPLAINTS &mdash; {complaints.length}</span>
            <Button variant="primary" size="sm" onClick={() => setTab('new')}>+ New Issue</Button>
          </div>
          {loading ? (
            <div className="dash-loading"><div className="spinner" /></div>
          ) : complaints.length === 0 ? (
            <div className="dash-empty">No complaints submitted yet.</div>
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
                    <span className="meta-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selected?._id === c._id && (
                    <div className="complaint-detail fade-in">
                      <p className="complaint-desc">{c.description}</p>
                      {c.remarks?.length > 0 && (
                        <div className="remarks">
                          <p className="remarks-label">REMARKS</p>
                          {c.remarks.map((r, i) => (
                            <div key={i} className="remark-item">
                              <span className="remark-author">{r.addedBy?.username || 'Staff'}</span>
                              <span className="remark-text">{r.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'new' && (
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-label">NEW COMPLAINT</span>
          </div>
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">TITLE</label>
              <input className="form-input" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Brief summary of the issue" />
            </div>
            <div className="form-field">
              <label className="form-label">CATEGORY</label>
              <select className="form-input form-select" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">DESCRIPTION</label>
              <textarea className="form-input form-textarea" rows={5} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue in detail" />
            </div>
            <Button type="submit" variant="primary" loading={submitting}>Submit Complaint</Button>
          </form>
        </div>
      )}

      {tab === 'chat' && (
        <div className="dash-section">
          <ChatWindow />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
