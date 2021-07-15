function generateLocalStorageKey(dataset, latlon) {
  return dataset + '-' + latlon.join(',');
}

export default generateLocalStorageKey;
