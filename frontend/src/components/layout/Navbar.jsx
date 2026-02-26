import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = ({ dashboard = false }) => {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-left">
          {dashboard && (
            <button className="navbar-hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-mark">■</span>
            <span className="navbar-logo-text">ASTU ISSUE TRACKER</span>
          </Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <span className="navbar-user">
                {user.username} <span className="navbar-role">/ {user.role}</span>
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
