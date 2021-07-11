import { SET_DATE } from '../actions';

const search = new URLSearchParams(location.search);

function date(
  state = search.get('date')
    ? new Date(decodeURIComponent(search.get('date')))
    : new Date(),
  action
) {
  switch (action.type) {
    case SET_DATE:
      return action.date;
    default:
      return state;
  }
}

export default date;
