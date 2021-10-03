import findCell from './findCell.js';

export default (elem) => {
  const time = elem.children
    .find((el) => findCell(el, 'cell-time'))
    ?.children[0]?.data.trim();

  const [beginsAt, endsAt] = time.split('-');

  return { beginsAt, endsAt };
};
