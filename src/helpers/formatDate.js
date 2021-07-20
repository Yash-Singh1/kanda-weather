import months from '../data/months';

function formatDate(dateParameter) {
  return `${
    months[dateParameter.getMonth()]
  } ${dateParameter.getDate()}, ${dateParameter.getFullYear()}`;
}

export default formatDate;
