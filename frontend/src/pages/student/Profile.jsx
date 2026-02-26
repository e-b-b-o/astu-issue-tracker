import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import '../student/StudentDashboard.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in-up">
      <p className="dash-eyebrow">ACCOUNT</p>
      <h1 className="dash-title" style={{ marginBottom: 32 }}>Profile</h1>

      <div style={{ maxWidth: 480 }}>
        <div className="complaint-list">
          <div className="complaint-card" style={{ cursor: 'default' }}>
            <div className="complaint-card-meta" style={{ marginBottom: 10 }}>
              <span className="meta-tag">Username</span>
            </div>
            <span className="complaint-title">{user?.username}</span>
          </div>
          <div className="complaint-card" style={{ cursor: 'default' }}>
            <div className="complaint-card-meta" style={{ marginBottom: 10 }}>
              <span className="meta-tag">Email</span>
            </div>
            <span className="complaint-title">{user?.email}</span>
          </div>
          <div className="complaint-card" style={{ cursor: 'default' }}>
            <div className="complaint-card-meta" style={{ marginBottom: 10 }}>
              <span className="meta-tag">Role</span>
            </div>
            <Badge label={user?.role} type="role" />
          </div>
          <div className="complaint-card" style={{ cursor: 'default' }}>
            <div className="complaint-card-meta" style={{ marginBottom: 10 }}>
              <span className="meta-tag">Member Since</span>
            </div>
            <span className="complaint-title">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
