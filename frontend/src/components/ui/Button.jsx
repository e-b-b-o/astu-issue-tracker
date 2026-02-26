import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full' : '',
        loading ? 'btn--loading' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <>
          <span className="btn-spinner" aria-hidden="true" />
          <span className="sr-only">Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
