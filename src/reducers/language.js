import { SET_LANGUAGE } from '../actions';

function language(
  state = localStorage.getItem('language') || 'English',
  action
) {
  switch (action.type) {
    case SET_LANGUAGE:
      localStorage.setItem('language', action.language);
      return action.language;
    default:
      return state;
  }
}

export default language;
