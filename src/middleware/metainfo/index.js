import controller from './controller.js';
import isValid from './validator.js';

class Metainfo {
  constructor() {
    this.isValid = isValid;
    this.controller = controller;
  }
}

export default new Metainfo();
