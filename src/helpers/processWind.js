function processWind(data) {
  return Object.entries(data)
    .filter((entry) => entry[1].slice(0, -7) == 0)
    .map((entry) => entry[0])
    .join(',');
}

export default processWind;
