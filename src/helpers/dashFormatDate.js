function dashFormatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() < 10 ? 0 : ''}${
    date.getMonth() + 1
  }-${date.getDate() < 10 ? 0 : ''}${date.getDate()}`;
}

export default dashFormatDate;
