const QUERIES = {
  'Uyo, NG': (query) => {
    return ['uyo, ng', 'uyo, nigeria', 'uyo', 'ng, uyo', 'nigeria, uyo']
      .reduce(
        (accumulator, value) => [...accumulator, value, value.replace(',', '')],
        []
      )
      .includes(query.toLowerCase().trim());
  },
  'Accra, GH': (query) => {
    return ['accra, gh', 'accra, ghana', 'accra', 'gh, accra', 'ghana, accra']
      .reduce(
        (accumulator, value) => [...accumulator, value, value.replace(',', '')],
        []
      )
      .includes(query.toLowerCase().trim());
  }
};

export default QUERIES;
