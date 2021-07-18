function processSurfaceRunoff(data) {
  return Object.fromEntries(
    Object.entries(data)
      .filter((entry) => entry[1].slice(0, -5) >= 0.1)
      .map((entry) => [entry[0], 0])
  );
}

export default processSurfaceRunoff;
