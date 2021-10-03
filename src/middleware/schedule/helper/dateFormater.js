import moment from 'moment';

export default ([year, weekCount]) => `${moment(year).add(weekCount, 'weeks')
  .startOf('isoweek')
  .format('DD.MM.YYYY')} 0:00:00`;
