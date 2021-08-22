import { SET_LANGUAGE } from '../actions';
import LANGUAGE_CODES from '../data/languageCodes';

function language(
  state = localStorage.getItem('language') || 'English',
  action
) {
  let nextLanguage;

  switch (action.type) {
    case SET_LANGUAGE:
      localStorage.setItem('language', action.language);
      nextLanguage = action.language;
      break;
    default:
      nextLanguage = state;
      break;
  }

  if (document.documentElement.lang !== LANGUAGE_CODES[nextLanguage]) {
    document.documentElement.lang = LANGUAGE_CODES[nextLanguage];
  }

  return nextLanguage;
}

export default language;
