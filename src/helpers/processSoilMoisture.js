import { MIN_FLOOD_SOIL_MOISTURE } from '../data/magicNumbers';

function processSoilMoisture(data) {
  return Object.entries(data)
    .filter((entry) => entry[1] >= MIN_FLOOD_SOIL_MOISTURE)
    .map((entry) => entry[0])
    .join(',');
}

export default processSoilMoisture;
