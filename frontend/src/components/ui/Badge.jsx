import React from 'react';
import './Badge.css';

const STATUS_MAP = {
  'Open':        'badge--open',
  'In Progress': 'badge--progress',
  'Resolved':    'badge--resolved',
};

const ROLE_MAP = {
  'admin':   'badge--admin',
  'staff':   'badge--staff',
  'student': 'badge--student',
};

const Badge = ({ label, type = 'status' }) => {
  const map = type === 'role' ? ROLE_MAP : STATUS_MAP;
  const cls  = map[label] || '';
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default Badge;
