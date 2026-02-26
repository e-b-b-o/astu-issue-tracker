import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUI } from '../context/UIContext';
import { validateEmail } from '../utils/validators';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useUI();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      addToast('Password reset link sent to your email', 'success');
    }, 1500);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <NavLink to="/login" className="back-link">
          <ArrowLeft size={16} /> Back to Login
        </NavLink>
        
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {isSuccess ? (
          <div className="success-state fade-in text-center py-md" style={{ padding: 'var(--spacing-lg) 0' }}>
            <CheckCircle2 size={64} className="text-success" style={{ margin: '0 auto var(--spacing-md)', color: 'var(--success)' }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Check your inbox</h3>
            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="secondary" className="w-full">
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="ASTU Email Address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
              placeholder="student@astu.edu.et"
            />
            
            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
