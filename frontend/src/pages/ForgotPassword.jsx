import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      // Always show success to avoid leaking info
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <Link to="/login" className="auth-back-link"><ArrowLeft size={14} /> Back to Login</Link>
      <div className="auth-card fade-in-up">
        <div className="auth-header">
          <div className="auth-logo">■ ASTU TRACKER</div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email and we'll send you your password.</p>
        </div>

        {sent ? (
          <div className="auth-success">
            <p>If this email exists, you will receive your password shortly.</p>
            <p style={{ marginTop: 16 }}>
              <Link to="/login" className="auth-link">Back to Sign In</Link>
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="fp-email">EMAIL ADDRESS</label>
              <input
                id="fp-email"
                type="email"
                className="auth-input"
                placeholder="you@astu.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Send Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
