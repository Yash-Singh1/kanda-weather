import data from './data';
import language from './language';
import query from './query';
import darkMode from './darkMode';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ data, language, query, darkMode });

export default rootReducer;
