function processSoilMoisture(data) {
  return Object.entries(data)
    .filter((entry) => entry[1] >= 0.47)
    .map((entry) => entry[0])
    .join(',');
}

export default processSoilMoisture;
