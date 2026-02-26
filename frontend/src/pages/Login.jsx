import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/ui/Button';
import './Auth.css';

const Login = () => {
  const { login, loading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      addToast('Signed in successfully', 'success');
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
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Enter your credentials to access the system.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="you@astu.edu.et"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">PASSWORD</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
