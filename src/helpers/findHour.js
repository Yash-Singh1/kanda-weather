import generateLocalStorageKey from './generateLocalStorageKey';
import COORDINATES from '../data/latlon';
import dashFormatDate from './dashFormatDate';

function findHour(dclimateData, dataset, query, date, stage) {
  return dclimateData[
    generateLocalStorageKey(dataset, COORDINATES[query])
  ].find(
    (surfaceRunoffDate) =>
      surfaceRunoffDate.startsWith(dashFormatDate(date)) &&
      new RegExp(
        String.raw`^\d{4}-\d{2}-\d{2} ${
          stage === 'Morning'
            ? '(0[1-9]|11)'
            : (stage === 'Afternoon'
            ? '(1[2-6])'
            : stage === 'Evening'
            ? '(1[7-9]|20)'
            : '(2[1-4])')
        }`
      ).test(surfaceRunoffDate)
  );
}

export default findHour;
