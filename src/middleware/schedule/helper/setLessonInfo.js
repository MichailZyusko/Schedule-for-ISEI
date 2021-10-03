import findCell from './findCell.js';

export default (elem, className) => elem.children
  .find((el) => findCell(el, className))
  ?.children[0]?.data.trim();
