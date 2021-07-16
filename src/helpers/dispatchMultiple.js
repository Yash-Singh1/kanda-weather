function dispatchMultiple(dispatch) {
  return function runActions(...actions) {
    dispatch(actions[0]).then(() => {
      if (actions.length > 1) {
        runActions(...actions.slice(1));
      }
    });
  };
}

export default dispatchMultiple;
