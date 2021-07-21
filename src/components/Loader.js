import React from 'react';
import PropTypes from 'prop-types';

function Loader({ center }) {
  return (
    <span className={`loader${center ? '-center' : ''}`}></span>
  );
}

Loader.propTypes = {
  center: PropTypes.bool
};

export default Loader;
