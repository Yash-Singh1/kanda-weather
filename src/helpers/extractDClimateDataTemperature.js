import dashFormatDate from './dashFormatDate';
import COORDINATES from '../data/latlon';
import generateLocalStorageKey from './generateLocalStorageKey';

function extractDClimateDataTemperature(dclimateData, date, query, tempType) {
  return (
    Math.round(
      (dclimateData[
        generateLocalStorageKey(
          'cpcc_temp_' + tempType + '-daily',
          COORDINATES[query]
        )
      ][dashFormatDate(date)].slice(0, -6) -
        32) *
        (5 / 9) *
        10
    ) / 10
  );
}

export default extractDClimateDataTemperature;
