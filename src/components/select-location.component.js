import _ from "lodash";

import template from "./select-location.component.html";

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
    $user = $injector.get("opendash/services/user");
    $location = $injector.get("opendash/services/location");

    $q = $injector.get("$q");

    this.$element = $element;

    this.style = {};
    this.available = [];
    this.items = [];
    this.output = [];
    this.dropdownValue = null;
  }

  async $onInit() {
    // validate data bindings
    if (!_.isObject(this.config)) {
      throw new Error(
        "Bad usage of od-select-location config attribute. Must be an Object."
      );
    }

    if (!_.isFunction(this.watch)) {
      throw new Error(
        "Bad usage of od-select-location watch attribute. Must be a Function."
      );
    }

    try {
      await $user.wait();
      await $location.wait();

      this.available = $location.locations;

      this.searchOnChange();

      if (this.config.maxHeight) {
        this.style = {
          "overflow-y": "auto",
          "max-height": this.config.maxHeight
        };
      }

      if (this.config.initialSelection) {
        if (!_.isArray(this.config.initialSelection)) {
          throw new Error(
            "Bad usage of od-select-location config.initialSelection attribute. Must be an Array."
          );
        }

        for (const e of this.config.initialSelection) {
          if (this.isAvailable(e)) {
            this.output.push(e);
          }
        }
      }

      this.triggerWatch();

      await $q.resolve();
    } catch (error) {
      logger.error(error);
    }
  }

  searchOnChange() {
    this.items = this.available;

    if (this.searchText) {
      this.items = this.items.filter(i => {
        let item = this.vo ? i[0] : i;

        let nameMatch = item.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

        return nameMatch;
      });
    }
  }

  isSelected(e) {
    return this.output.indexOf(e) >= 0;
  }

  isAvailable(e) {
    return _.find(this.available, a => a.id === e) ? true : false;
  }

  toggleSelected(e) {
    let isSelected = this.isSelected(e);

    if (!this.config.multi) {
      this.output.length = 0;
    }

    if (isSelected) {
      _.pull(this.output, e);
    } else {
      this.output.push(e);
    }

    this.triggerWatch();
  }

  triggerWatch() {
    if (this.config.multi) {
      this.watch(this.output);
    } else {
      this.watch(this.output[0] || undefined);
    }
  }
}

let component = {
  controller,
  template,
  bindings: {
    config: "<",
    watch: "<"
  }
};

export default component;
