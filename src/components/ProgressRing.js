import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ProgressProvider from './ProgressProvider';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ProgressRing({ label, valueEnd }) {
  return (
    <Col xs={6}>
      <div className='mx-auto progress-ring'>
        <ProgressProvider valueStart={10} valueEnd={valueEnd}>
          {(value) => (
            <CircularProgressbarWithChildren
              value={value}
            >{`${label}: ${value}%`}</CircularProgressbarWithChildren>
          )}
        </ProgressProvider>
      </div>
    </Col>
  );
}

ProgressRing.propTypes = {
  label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  valueEnd: PropTypes.number
};

export default ProgressRing;
