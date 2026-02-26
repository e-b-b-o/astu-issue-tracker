import React, { useState } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { addToast } = useUI();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile updated successfully', 'success');
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      addToast('Password changed successfully', 'success');
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="profile-page fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card user-info-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              <span className="avatar-initials">{user.name.charAt(0)}</span>
            </div>
            <div className="user-details">
              <h2>{user.name}</h2>
              <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
            </div>
          </div>
          
          <div className="info-list">
            <div className="info-item">
              <Mail size={18} className="info-icon" />
              <div>
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>
            <div className="info-item">
              <Shield size={18} className="info-icon" />
              <div>
                <span className="info-label">Account Type</span>
                <span className="info-value">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-forms">
          {/* Edit Profile */}
          <div className="profile-card">
            <h3>Edit Personal Info</h3>
            <form onSubmit={handleSaveProfile} className="settings-form">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
              <div className="form-actions-profile">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword} className="settings-form">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="form-actions-profile">
                <Button type="submit" variant="secondary" disabled={isSaving}>
                  <Save size={16} /> Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
