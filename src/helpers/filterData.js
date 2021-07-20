import formatDate from './formatDate';

function filterData(data, query, date) {
  return data
    ? data.find((datapoint) =>
        datapoint.startsWith(
          `${decodeURIComponent(query)}: ${formatDate(date)}`
        )
      )
    : null;
}

export default filterData;
