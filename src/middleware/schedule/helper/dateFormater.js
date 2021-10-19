export default (dates) => {
  const date = new Date(dates);
  const myDate = new Date(date - (86400 * 1000 * (date.getUTCDay() - 1)));

  const day = myDate.getDate() > 9 ? `${myDate.getDate()}` : `0${myDate.getDate()}`;
  const month = myDate.getMonth() > 8 ? `${myDate.getMonth() + 1}` : `0${myDate.getMonth() + 1}`;
  const year = myDate.getFullYear();

  return `${day}.${month}.${year} 0:00:00`;
};
