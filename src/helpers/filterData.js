import formatDate from './formatDate';

function filterData(data, query, date) {
  return data
    ? data.filter((datapoint) =>
        datapoint.startsWith(
          `${decodeURIComponent(query)}: ${formatDate(date)}`
        )
      )[0]
    : null;
}

export default filterData;
