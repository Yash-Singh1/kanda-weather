import { SET_QUERY } from '../actions';

function query(
  state = new URLSearchParams(location.search).get('q') ||
    localStorage.getItem('query') ||
    '',
  action
) {
  let nextQuery;

  switch (action.type) {
    case SET_QUERY:
      localStorage.setItem('query', action.query);
      nextQuery = action.query;
      break;
    default:
      nextQuery = state;
      break;
  }

  if (localStorage.getItem('query') !== nextQuery) {
    localStorage.setItem('query', nextQuery);
  }

  return nextQuery;
}

export default query;
