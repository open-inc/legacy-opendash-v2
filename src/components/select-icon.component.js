import _ from "lodash";

import template from "./select-icon.component.html";

import Logger from "../helper/logger";
const logger = Logger("od-select-icon");

class controller {
  static get $inject() {
    return ["$injector", "$element"];
  }

  constructor($injector, $element) {
    this.selected = null;
    this.active = false;
    this.icons = [];
  }

  async $onInit() {
    // validate data bindings
    logger.assert(
      _.isArray(this.options),
      "Bad usage of od-select-icon options attribute. Must be an Array."
    );

    logger.assert(
      _.isFunction(this.watch),
      "Bad usage of od-select-icon watch attribute. Must be a Function."
    );

    if (this.selection) {
      logger.assert(
        _.isString(this.selection),
        "Bad usage of od-select-icon selection attribute. Must be a String."
      );

      this.selected = this.selection;
    }

    this.icons.push(...this.options);
  }

  get current() {
    let selection = this.icons.find(i => i.icon === this.selected);

    return selection
      ? selection
      : {
          label: "od.select.icon.placeholder",
          icon: "fa-question-circle-o"
        };
  }

  isSelected({ icon }) {
    return this.selected === icon;
  }

  toggleDropdown() {
    this.active = !this.active;
  }

  select({ icon }) {
    this.toggleDropdown();

    this.selected = icon;

    this.watch(icon);
  }
}

let component = {
  controller,
  template,
  bindings: {
    selection: "<",
    options: "<",
    watch: "<"
  }
};

export default component;
