import controller from './controller.js';
import isValid from './validator.js';

class Schedule {
  constructor() {
    this.isValid = isValid;
    this.controller = controller;
  }
}

export default new Schedule();
