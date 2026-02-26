import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-highlight">ASTU</span> Tracker
            <p className="footer-tagline">Smart Complaint & Issue Tracking System</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Adama Science and Technology University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
