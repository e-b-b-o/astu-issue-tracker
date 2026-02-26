import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/ui/Button';
import './Auth.css';

const Register = () => {
  const { register, loading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'student' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      const user = await register(form);
      addToast('Account created successfully', 'success');
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card fade-in-up">
        <div className="auth-header">
          <div className="auth-logo">■ ASTU TRACKER</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to start submitting and tracking issues.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">FULL NAME</label>
            <input id="username" name="username" type="text" className="auth-input"
              placeholder="Your Name" value={form.username} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">EMAIL ADDRESS</label>
            <input id="email" name="email" type="email" className="auth-input"
              placeholder="you@astu.edu.et" value={form.email} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">PASSWORD</label>
            <input id="password" name="password" type="password" className="auth-input"
              placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="role">ROLE</label>
            <select id="role" name="role" className="auth-input auth-select"
              value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
