import textData from './textData';
import language from './language';
import query from './query';
import darkMode from './darkMode';
import date from './date';
import dclimateData from './dclimateData';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  date,
  textData,
  language,
  query,
  darkMode,
  dclimateData
});

export default rootReducer;
