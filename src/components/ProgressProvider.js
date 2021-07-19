/**
 * Brought from https://codesandbox.io/s/0zk372m7l?file=/ProgressProvider.js:0-434
 */

import { useEffect, useState } from 'react';
import { useIsMounted } from 'react-tidy';

// If you don't have a version of React that supports
// hooks, you can use a class-based version of this
// component in ProgressProviderUsingClass.js
const ProgressProvider = ({ valueStart, valueEnd, children }) => {
  const [value, setValue] = useState(valueStart);
  const [timeouts, setTimeouts] = useState([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (value !== valueEnd) {
      setTimeouts([
        ...timeouts,
        setTimeout(() => {
          if (isMounted()) setValue(value + 1);
        }, 15)
      ]);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [value]);

  return children(value);
};

export default ProgressProvider;
