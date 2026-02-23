import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUI } from '../context/UIContext';
import { validateEmail, validatePassword } from '../utils/validators';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUI();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    // Simulate API Call for demo
    setTimeout(() => {
      setIsLoading(false);
      addToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <NavLink to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </NavLink>
        
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join ASTU Tracker to submit complaints</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Abebe Kebede"
          />
          
          <Input
            label="ASTU Email Address"
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
          
          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <NavLink to="/login" className="auth-link">Sign In</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
