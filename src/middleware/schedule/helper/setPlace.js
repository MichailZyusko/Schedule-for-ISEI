import findCell from './findCell.js';

// eslint-disable-next-line consistent-return
export default (elem) => {
  try {
    const place = elem.children
      .find((el) => findCell(el, 'cell-auditory'))
      ?.children[0]?.data.trim();
    const build = place.slice(place.indexOf('К'));
    const room = place.substr(place.indexOf(' ') + 1, 3);

    return {
      build: build === ',' ? '' : build,
      room: room === ',' ? '' : room,
    };
  } catch (e) {
    console.log(e);
  }
};
