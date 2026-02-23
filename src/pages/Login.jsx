import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { validateEmail } from '../utils/validators';
import './Auth.css'; // Shared CSS for auth pages

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    // Simulate API call for demo accounts
    setTimeout(() => {
      let token = '';
      let userData = null;
      
      const emailLower = formData.email.toLowerCase();
      
      if (emailLower === 'student@astu.edu.et') {
        token = 'demo-student-token';
        userData = { id: 's1', name: 'Demo Student', role: 'STUDENT', email: emailLower };
      } else if (emailLower === 'staff@astu.edu.et') {
        token = 'demo-staff-token';
        userData = { id: 't1', name: 'Demo Staff', role: 'STAFF', email: emailLower };
      } else if (emailLower === 'admin@astu.edu.et') {
        token = 'demo-admin-token';
        userData = { id: 'a1', name: 'Demo Admin', role: 'ADMIN', email: emailLower };
      } else {
        setIsLoading(false);
        addToast('Invalid credentials. Use student|staff|admin@astu.edu.et for demo.', 'error');
        return;
      }
      
      login(token, userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      navigate(`/dashboard/${userData.role.toLowerCase()}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <NavLink to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </NavLink>
        
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your ASTU Tracker account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email Address"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="student@astu.edu.et"
          />
          
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />
          
          <div className="auth-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <NavLink to="/forgot-password" className="forgot-link">Forgot Password?</NavLink>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <NavLink to="/register" className="auth-link">Sign Up</NavLink></p>
        </div>
        
        {/* Demo Hint */}
        <div className="demo-hint mt-md text-center text-sm text-secondary p-sm bg-tertiary rounded-md mt-4">
          <p className="font-semibold mb-1">Demo Accounts:</p>
          <p>student@astu.edu.et</p>
          <p>staff@astu.edu.et</p>
          <p>admin@astu.edu.et</p>
          <p className="text-xs mt-1">(Any password works)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
