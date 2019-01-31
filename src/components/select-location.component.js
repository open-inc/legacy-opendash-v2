import _ from "lodash";

import template from "./select-location.component.html";

import Logger from "../helper/logger";
const logger = Logger("od-select-location");

let $user;
let $location;
let $notification;
let $q;

class controller {
  static get $inject() {
    return ["$injector", "$element"];
  }

  constructor($injector, $element) {
    $user = $injector.get("opendash/services/user");
    $location = $injector.get("opendash/services/location");
    $notification = $injector.get("opendash/services/notification");

    $q = $injector.get("$q");

    this.$element = $element;

    this.style = {};
    this.available = [];
    this.items = [];
    this._output = [];
    this.dropdownValue = null;
  }

  get output() {
    if (this.lsm) {
      return $location.current.map(loc => loc.id);
    } else {
      return this._output;
    }
  }

  async $onInit() {
    // validate data bindings
    if (!_.isObject(this.config)) {
      throw new Error(
        "Bad usage of od-select-location config attribute. Must be an Object."
      );
    }

    this.available = $location.locations;

    if (this.config.locationServiceMode || this.config.lsm) {
      this.lsm = true;
    } else {
      this.lsm = false;
    }

    if (!this.lsm && !_.isFunction(this.watch)) {
      throw new Error(
        "Bad usage of od-select-location watch attribute. Must be a Function."
      );
    }

    try {
      await $user.wait();
      await $location.wait();

      this.searchOnChange();

      if (this.config.maxHeight) {
        this.style = {
          "overflow-y": "auto",
          "max-height": this.config.maxHeight
        };
      }

      if (!this.lsm && this.config.initialSelection) {
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

  searchOnChange() {}

  get items() {
    let items = this.available;

    if (this.searchText) {
      items = items.filter(i => {
        let item = this.vo ? i[0] : i;

        let nameMatch = item.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

        return nameMatch;
      });
    }

    if (this.config.filter) {
      try {
        this.filterIsUsed = false;
        let length = items.length;
        items = items.filter(i => {
          return this.config.filter(i);
        });

        if (items.length !== length) {
          this.filterIsUsed = true;
        }
      } catch (error) {
        logger.error("filter function error:", error);
      }
    }

    return items;
  }

  set items(values) {}

  showLocation({ id }) {
    if (this.searchText || this.filterIsUsed) {
      return true;
    }

    return !$location.isChild(id);
  }

  isSelected({ id, children }) {
    if (!children || children.length === 0) {
      return this.output.indexOf(id) >= 0;
    }

    return children
      .map(child => child.id)
      .map(id => this.isSelected({ id }))
      .reduce((acc, value) => acc && value, true);
  }

  isAvailable(id) {
    return _.find(this.available, a => a.id === id) ? true : false;
  }

  toggleSelected({ id, children }) {
    let isSelected = this.isSelected({ id, children });

    console.log("select", isSelected, id, children);

    if (children && children.length > 0) {
      if (isSelected) {
        $notification.danger("od.select.location.min");
        return;
      }

      $location.setLocation(children.map(child => child.id));

      return;
    }

    if (this.lsm) {
      let output = [...this.output];

      if (!this.config.multi) {
        output.length = 0;
      }

      if (output.includes(id)) {
        _.pull(output, id);
      } else {
        output.push(id);
      }

      if (output.length === 0) {
        $notification.danger("od.select.location.min");
      }

      $location.setLocation(output);
    } else {
      if (!this.config.multi) {
        this.output.length = 0;
      }

      if (isSelected) {
        _.pull(this.output, id);
      } else {
        this.output.push(id);
      }

      this.triggerWatch();
    }
  }

  triggerWatch() {
    if (!this.lsm) {
      this.watch(this.output);
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
