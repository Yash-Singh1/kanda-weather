import { RECIEVE_DCLIMATE_DATA } from '../actions';
import generateLocalStorageKey from '../helpers/generateLocalStorageKey';

function dclimateData(state = {}, action) {
  switch (action.type) {
    case RECIEVE_DCLIMATE_DATA:
      return {
        ...state,
        [generateLocalStorageKey(action.dataset, action.latlon)]: action.data
      };
    default:
      return state;
  }
}

export default dclimateData;
