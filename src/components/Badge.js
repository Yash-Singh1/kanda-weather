import React from 'react';
import PropTypes from 'prop-types';

function Badge({ children, bg }) {
  return (
    <span className={`badge bg-${bg} ${bg === 'warning' ? 'text-dark' : ''}`}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  bg: PropTypes.string.isRequired
};

export default Badge;
