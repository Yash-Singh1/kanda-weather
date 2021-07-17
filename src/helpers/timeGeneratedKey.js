function timeGeneratedKey(dataset) {
  return dataset.startsWith('cpcc') ? 'time last generated' : 'time generated';
}

export default timeGeneratedKey;
