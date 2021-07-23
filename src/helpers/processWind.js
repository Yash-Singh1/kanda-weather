import { MIN_WIND_TO_CLEAR } from '../data/magicNumbers';

function processWind(data) {
  return [
    ...new Set(
      Object.entries(data)
        .filter((entry) => Math.abs(entry[1].slice(0, -7)) >= MIN_WIND_TO_CLEAR)
        .map((entry) => entry[0])
        .map((entry) => entry.split(' ')[0])
    )
  ].join(',');
}

export default processWind;
