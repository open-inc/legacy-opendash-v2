import _ from "lodash";

import Logger from "../helper/logger";

const logger = Logger("opendash/services/location");

let $user;

export default class LocationService {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    $user = $injector.get("opendash/services/user");

    this.observer = [];
    this.waiting = [];

    this.loading = true;
    this.supported = false;
    this.current = null;
    this.currentHash = null;
    this.locations = [];

    // debounce trigger observers
    this.triggerObservers = _.debounce(this.triggerObservers, 100);

    this.init();
  }

  // get ls() {
  //   return (
  //     JSON.parse(
  //       window.localStorage.getItem("opendash/services/location::current")
  //     ) || null
  //   );
  // }

  // set ls(value) {
  //   window.localStorage.setItem(
  //     "opendash/services/location::current",
  //     JSON.stringify(value)
  //   );
  // }

  async init() {
    try {
      await $user.wait();

      let current = await $user.getCurrentLocations();
      let locations = await $user.listLocations();
      let idArray = [];

      logger.assert(_.isArray(locations), "Locations must be an Array.");

      logger.assert(
        locations.length > 0,
        "There must be at least one location."
      );

      for (const loc of locations) {
        logger.assert(_.isObject(loc), "Each location must be an Object.");

        logger.assert(
          _.isObject(loc),
          "Each location must have an id attribute."
        );

        logger.assert(
          !idArray.includes(loc.id),
          "Each location must have an uniq id attribute."
        );

        idArray.push(loc.id);
      }

      if (!current || !this.validateCurrent(locations, current)) {
        current = [locations[0].id];
      }

      this.locations.push(...locations);
      this.setLocation(current);
      this.supported = true;
      this.loading = false;
    } catch (error) {
      logger.error(error);
      this.supported = false;
    }

    this.waiting.forEach(async resolve => {
      resolve();
    });
  }

  wait() {
    return new Promise((resolve, reject) => {
      if (!this.loading) {
        resolve();
      } else {
        this.waiting.push(resolve);
      }
    });
  }

  setLocation(ids) {
    logger.assert(
      _.isArray(ids),
      "Setting the current location failed. ids must be an Array."
    );

    if (ids.length < 1) {
      logger.log(
        "Setting the current location failed. ids must have at least one entry."
      );
      return;
    }

    ids = _.sortBy(ids);

    let newHash = ids.join(",");

    if (this.currentHash === newHash) {
      logger.log(
        "Setting the current location failed. ids must not be the same as before."
      );
      return;
    }

    logger.assert(
      this.validateCurrent(this.locations, ids),
      "Setting the current location failed. All ids must be in the list of locations."
    );

    this.current = ids.map(id => this.locations.find(loc => loc.id === id));
    this.currentHash = newHash;

    logger.log(`Locations set (${this.currentHash})`);

    this.triggerObservers();

    $user.setCurrentLocations(ids).then(null, error => logger.error(error));
  }

  validateCurrent(locations, current) {
    if (!_.isArray(current)) {
      return false;
    }

    let availableIds = locations.map(loc => loc.id);
    let result = current
      .map(id => availableIds.includes(id))
      .reduce((acc, value) => acc && value, true);
    return result;
  }

  triggerObservers() {
    logger.log(`Trigger observers (${this.currentHash})`);

    for (const observer of this.observer) {
      try {
        observer(this.current).then(null, error => {
          logger.error("Observer is throwing an error: \n", error);
        });
      } catch (error) {
        logger.error("Observer is throwing an error: \n", error);
      }
    }
  }

  async onChange(observer) {
    if (_.isFunction(observer)) {
      this.observer.push(observer);

      if (this.current) {
        await observer(this.current);
      }
    }
  }
}
