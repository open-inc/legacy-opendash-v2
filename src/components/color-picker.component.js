import Logger from "../helper/logger";

const logger = Logger("od.ui.color-picker");

import template from "./color-picker.component.html";
import COLORS from "./colors.array";

import _ from "lodash";

const MOUSE_POS = {};

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);

function onMouseUpdate(e) {
  MOUSE_POS.x = e.pageX;
  MOUSE_POS.y = e.pageY;
}

class controller {
  constructor() {
    this.colors = _.uniq(COLORS);

    this.active = false;
  }

  $onInit() {
    if (this.color) {
      if (!this.validateHex(this.color)) {
        logger.warn(
          "Bad usage of od-color-picker default attribute. Must be a Hex Color."
        );
      }
    } else {
      this.color = COLORS[0];
    }
  }

  togglePicker() {
    this.active = !this.active;

    this.pickerStyle = {
      top: MOUSE_POS.y,
      left: MOUSE_POS.x
    };
  }

  select(color) {
    this.color = color;
    this.togglePicker();
  }

  validateHex() {
    return true;
  }
}

let component = {
  controller,
  template,
  bindings: {
    color: "="
  }
};

export default component;
