import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ProgressProvider from './ProgressProvider';

function ProgressRing({ label, valueEnd }) {
  return (
    <div className='col-6'>
      <div className='mx-auto progress-ring'>
        <ProgressProvider valueStart={10} valueEnd={valueEnd}>
          {(value) => (
            <CircularProgressbarWithChildren
              value={value}
            >{`${label}: ${value}%`}</CircularProgressbarWithChildren>
          )}
        </ProgressProvider>
      </div>
    </div>
  );
}

export default ProgressRing;
