import findCell from './findCell.js';

export default (elem) => elem.children
  .find((el) => findCell(el, 'cell-date'))
  ?.children[2]?.children[0]?.data.trim();
