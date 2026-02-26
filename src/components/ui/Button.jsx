import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', size = 'md', type = 'button', disabled = false, className = '', ...props }) => {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;
  
  return (
    <button 
      type={type} 
      className={baseClass} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
