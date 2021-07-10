import months from '../data/months';

function formatDate(dateParam) {
  return `${
    months[dateParam.getMonth()]
  } ${dateParam.getDate()}, ${dateParam.getFullYear()}`;
}

export default formatDate;
