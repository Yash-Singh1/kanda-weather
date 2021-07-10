const QUERIES = {
  'Uyo, NG': (query) => {
    return ['uyo, ng', 'uyo, nigeria', 'uyo', 'ng, uyo', 'nigeria, uyo']
      .reduce((acc, val) => acc.concat(val, val.replace(',', '')), [])
      .includes(query.toLowerCase().trim());
  },
  'Accra, GH': (query) => {
    return ['accra, gh', 'accra, ghana', 'accra', 'gh, accra', 'ghana, accra']
      .reduce((acc, val) => acc.concat(val, val.replace(',', '')), [])
      .includes(query.toLowerCase().trim());
  }
};

export default QUERIES;
