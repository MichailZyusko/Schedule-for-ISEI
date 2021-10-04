import findCell from './findCell.js';

// eslint-disable-next-line consistent-return
export default (elem) => {
  try {
    const time = elem.children
      .find((el) => findCell(el, 'cell-time'))
      ?.children[0]?.data.trim();

    const [beginsAt, endsAt] = time.split('-');

    return { beginsAt, endsAt };
  } catch (e) {
    console.log(e);
  }
};
