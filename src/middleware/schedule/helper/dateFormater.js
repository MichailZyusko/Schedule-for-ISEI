import moment from 'moment';

export default ([year, weekCount]) => `${moment(year).add(weekCount, 'weeks')
  .startOf('isoWeek')
  .format('DD.MM.YYYY')} 0:00:00`;
