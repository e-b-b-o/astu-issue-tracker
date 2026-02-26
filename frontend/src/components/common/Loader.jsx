import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen, size = 'md' }) => {
  const loaderEl = <div className={`spinner spinner-${size}`}></div>;

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderEl}
      </div>
    );
  }

  return (
    <div className="loader-container">
      {loaderEl}
    </div>
  );
};

export default Loader;
