import _ from "lodash";

import template from "./select-location-item.component.html";

import Logger from "../helper/logger";
const logger = Logger("od-select-location");

let $user;
let $location;
let $q;

class controller {
  static get $inject() {
    return ["$injector", "$element"];
  }

  constructor($injector, $element) {
    $injector.get("opendash/services/location");
  }

  async $onInit() {}
}

let component = {
  controller,
  template,
  bindings: {
    location: "<",
    locationPicker: "<"
  }
};

export default component;
