import { SET_TEXT_DATA } from '../actions';

function textData(state = [], action) {
  switch (action.type) {
    case SET_TEXT_DATA:
      return action.textData;
    default:
      return state;
  }
}

export default textData;
