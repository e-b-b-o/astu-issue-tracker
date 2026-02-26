import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', id, error, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        type={type}
        id={id}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-text fade-in">{error}</span>}
    </div>
  );
};

export default Input;
