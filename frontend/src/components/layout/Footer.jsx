import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <span className="footer-brand">■ ASTU TRACKER</span>
      <span className="footer-copy">
        © {new Date().getFullYear()} Adama Science and Technology University. All rights reserved.
      </span>
    </div>
  </footer>
);

export default Footer;
