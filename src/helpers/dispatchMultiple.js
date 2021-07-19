function dispatchMultiple(dispatch, isMounted) {
  return function runActions(...actions) {
    if (isMounted()) {
      dispatch(actions[0]).then?.(() => {
        if (actions.length > 1) {
          runActions(...actions.slice(1));
        }
      });
    }
  };
}

export default dispatchMultiple;
