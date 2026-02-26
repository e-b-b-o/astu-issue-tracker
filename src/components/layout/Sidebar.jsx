import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { ROLES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();

  if (!user) return null;

  const role = user.role;

  const navLinks = [
    { to: `/dashboard/${role.toLowerCase()}`, icon: LayoutDashboard, label: 'Dashboard', roles: [ROLES.STUDENT, ROLES.STAFF, ROLES.ADMIN] },
    { to: '/dashboard/complaints/new', icon: FileText, label: 'Submit Ticket', roles: [ROLES.STUDENT] },
    { to: '/dashboard/admin/analytics', icon: BarChart2, label: 'Analytics', roles: [ROLES.ADMIN] },
    { to: '/dashboard/profile', icon: User, label: 'Profile', roles: [ROLES.STUDENT, ROLES.STAFF, ROLES.ADMIN] },
  ];

  const allowedLinks = navLinks.filter(link => link.roles.includes(role));

  return (
    <>
      <div className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header mobile-only">
          <span className="sidebar-title">Menu</span>
          <button className="close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {allowedLinks.map((link, idx) => (
              <li key={idx} className="nav-item-li">
                <NavLink 
                  to={link.to} 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={closeSidebar}
                  end={link.to.endsWith('profile') ? false : true} // Avoid sub-route mismatches
                >
                  <link.icon size={20} className="sidebar-icon" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
