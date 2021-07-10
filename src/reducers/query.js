import { SET_QUERY } from '../actions';

function query(
  state = new URLSearchParams(location.search).get('q') ||
    localStorage.getItem('query') ||
    '',
  action
) {
  switch (action.type) {
    case SET_QUERY:
      localStorage.setItem('query', action.query);
      return action.query;
    default:
      return state;
  }
}

export default query;
