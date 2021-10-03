import findCell from './findCell.js';

export default (elem) => elem.children
  .find((el) => findCell(el, 'cell-date'))
  ?.children[0]?.children[0]?.data.trim();
