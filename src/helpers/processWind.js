function processWind(data) {
  return Object.entries(data)
    .filter((entry) => Math.abs(entry[1].slice(0, -7)) >= 4)
    .map((entry) => entry[0])
    .join(',');
}

export default processWind;
