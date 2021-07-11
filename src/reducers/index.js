import data from './data';
import language from './language';
import query from './query';
import darkMode from './darkMode';
import date from './date';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ date, data, language, query, darkMode });

export default rootReducer;
