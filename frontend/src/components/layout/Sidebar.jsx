import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import {
  LayoutDashboard, FileText, MessageSquare, BarChart2,
  Users, Database, Settings, X,
} from 'lucide-react';
import './Sidebar.css';

const NAV = {
  student: [
    { to: '/dashboard/student',  label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/dashboard/profile',  label: 'Profile',      icon: Users },
  ],
  staff: [
    { to: '/dashboard/staff',    label: 'Dashboard',    icon: LayoutDashboard },
  ],
  admin: [
    { to: '/dashboard/admin',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/dashboard/analytics', label: 'Analytics',   icon: BarChart2 },
    { to: '/dashboard/users',    label: 'Users',        icon: Users },
    { to: '/dashboard/documents', label: 'Documents',   icon: Database },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();
  const links = NAV[user?.role] || [];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">NAVIGATION</span>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close sidebar">
            <X size={14} />
          </button>
        </div>

        <nav className="sidebar-nav" role="navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
              }
              onClick={closeSidebar}
            >
              <Icon size={15} className="sidebar-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-role-badge">{user?.role?.toUpperCase()}</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
