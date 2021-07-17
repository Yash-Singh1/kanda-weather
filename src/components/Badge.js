import React from 'react';

function Badge({ children, bg }) {
  return (
    <span className={`badge bg-${bg} ${bg === 'warning' ? 'text-dark' : ''}`}>
      {children}
    </span>
  );
}

export default Badge;
