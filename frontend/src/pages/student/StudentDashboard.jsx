import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('description', form.description);
    if (form.image) {
      formData.append('attachment', form.image);
    }

    setSubmitting(true);
    try {
      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Complaint submitted', 'success');
      setForm({ title: '', description: '', category: CATEGORIES[0], image: null });
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
          {[['complaints', 'My Issues'], ['new', 'New Issue']].map(([k, l]) => (
            <button key={k} className={`dash-tab ${tab === k ? 'dash-tab--active' : ''}`}
              onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tab-content fade-in">
        {/* COMPLAINTS LIST */}
        {tab === 'complaints' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-label">MY COMPLAINTS &mdash; {complaints.length}</span>
              <Button size="sm" onClick={() => setTab('new')}>New Complaint</Button>
            </div>

            {loading ? (
              <div className="dash-loading"><div className="spinner" /></div>
            ) : complaints.length === 0 ? (
              <div className="dash-empty">You haven't submitted any complaints yet.</div>
            ) : (
              <div className="complaint-list">
                {complaints.map((c) => (
                  <div key={c._id} className="complaint-card" onClick={() => setSelected(selected?._id === c._id ? null : c)}>
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
                        
                        {c.image && (
                          <div className="complaint-image-box" style={{ marginTop: 15 }}>
                            <p className="remarks-label">ATTACHED IMAGE</p>
                            <img 
                              src={`data:${c.imageType || 'image/jpeg'};base64,${c.image}`} 
                              alt="Complaint" 
                              style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                        )}

                        {c.remarks?.length > 0 && (
                          <div className="remarks">
                            <p className="remarks-label">Staff Remarks</p>
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

        {/* NEW COMPLAINT FORM */}
        {tab === 'new' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-label">SUBMIT NEW COMPLAINT</span>
              <Button variant="secondary" size="sm" onClick={() => setTab('complaints')}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit} className="complaint-form dash-empty" style={{ textAlign: 'left', maxWidth: 'none' }}>
              <div className="form-field">
                <label className="form-label">Title</label>
                <input className="form-input" required placeholder="Brief summary of the issue"
                  value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              </div>
              <div className="form-field">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" required placeholder="Provide all necessary details..."
                  value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-field">
                <label className="form-label">Attach Image (Optional)</label>
                <input type="file" className="form-input" accept="image/*"
                  onChange={(e) => setForm({...form, image: e.target.files[0]})} />
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                  Supported formats: JPG, JPEG, PNG. Max 10MB.
                </p>
              </div>
              <Button type="submit" loading={submitting} disabled={submitting}>Submit Complaint</Button>
            </form>
          </div>
        )}
      </div>


    </div>
  );
};

export default StudentDashboard;
