export default ($, selector) => $(selector)[0]
  .children.filter((elem) => elem.name === 'option')
  .map((elem) => ({
    id: elem.attribs.value,
    label: elem.children[0].data.trim(),
  }));
