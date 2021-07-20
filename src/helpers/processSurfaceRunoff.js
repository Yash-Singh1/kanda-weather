import { MIN_SURFACE_RUNOFF } from '../data/magicNumbers';

function processSurfaceRunoff(data) {
  return Object.entries(data)
    .filter((entry) => entry[1].slice(0, -5) >= MIN_SURFACE_RUNOFF)
    .map((entry) => entry[0])
    .join(',');
}

export default processSurfaceRunoff;
