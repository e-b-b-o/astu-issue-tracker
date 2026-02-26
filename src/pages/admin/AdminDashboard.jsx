import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

// Mock Data
const SUMMARY_STATS = {
  totalComplaints: 124,
  resolvedComplaints: 89,
  inProgress: 20,
  open: 15,
  totalUsers: 450
};

const CATEGORY_DATA = [
  { name: 'Academic', value: 45 },
  { name: 'Hostel', value: 35 },
  { name: 'Maintenance', value: 25 },
  { name: 'Cafeteria', value: 15 },
  { name: 'Other', value: 4 },
];

const MONTHLY_DATA = [
  { month: 'Jan', complaints: 12, resolved: 10 },
  { month: 'Feb', complaints: 19, resolved: 15 },
  { month: 'Mar', complaints: 15, resolved: 12 },
  { month: 'Apr', complaints: 25, resolved: 18 },
  { month: 'May', complaints: 22, resolved: 20 },
  { month: 'Jun', complaints: 31, resolved: 14 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  const resolutionRate = Math.round((SUMMARY_STATS.resolvedComplaints / SUMMARY_STATS.totalComplaints) * 100);

  if (isLoading) {
    return (
      <div className="dashboard-content fade-in">
        <div className="dashboard-header mb-8">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">System Overview and Analytics</p>
        </div>
        <div className="skeleton-loader h-32 mb-8"></div>
        <div className="stats-grid">
          <div className="skeleton-loader h-64"></div>
          <div className="skeleton-loader h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Admin Analytics</h1>
          <p className="subtitle">Comprehensive overview of system activity.</p>
        </div>
      </div>

      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Complaints</h3>
            <p className="stat-value">{SUMMARY_STATS.totalComplaints}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Resolved</h3>
            <p className="stat-value">{SUMMARY_STATS.resolvedComplaints}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-value">{SUMMARY_STATS.open + SUMMARY_STATS.inProgress}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Users</h3>
            <p className="stat-value">{SUMMARY_STATS.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid mt-xl">
        {/* Monthly Trend Chart */}
        <div className="chart-card wide-chart">
          <h3>Complaints Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="complaints" name="Total Filed" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--success)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="chart-card">
          <h3>Complaints by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="chart-card">
          <h3>Resolution Performance</h3>
          <div className="resolution-wrapper">
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '150px', height: '150px' }}>
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--bg-tertiary)" strokeWidth="3"
                />
                <path
                  className="circle-fill"
                  strokeDasharray={`${resolutionRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--success)" strokeWidth="3"
                  strokeLinecap="round"
                />
                <text x="18" y="20.5" className="percentage">{resolutionRate}%</text>
              </svg>
            </div>
            <div className="resolution-text">
              <p>Great Job!</p>
              <span>{SUMMARY_STATS.resolvedComplaints} out of {SUMMARY_STATS.totalComplaints} tickets resolved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
