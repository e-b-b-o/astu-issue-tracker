import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', type = 'text', width, height }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`skeleton skeleton-${type} ${className}`} 
      style={style}
    ></div>
  );
};

export default Skeleton;
