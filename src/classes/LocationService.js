import _ from "lodash";

import Logger from "../helper/logger";
import Location from "./Location";
import LocationStore from "./LocationStore";

import $user from "../services/user.service";

const logger = Logger("opendash/services/location");

export default class LocationService {
  constructor() {
    this.observer = [];
    this.waiting = [];

    this.loading = true;
    this.supported = false;
    this.current = null;
    this.currentHash = null;
    this.locationIsChild = [];

    // debounce trigger observers
    this.triggerObservers = _.debounce(this.triggerObservers, 100);

    this.init();
  }

  get locations() {
    return [...LocationStore.values()];
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

      logger.assert(_.isArray(locations), "Locations must be an Array.");

      logger.assert(
        locations.length > 0,
        "There must be at least one location."
      );

      for (const loc of locations) {
        let location = new Location(loc);

        if (loc.children && _.isArray(loc.children)) {
          this.locationIsChild.push(...loc.children);
        }

        LocationStore.set(location.id, location);
      }

      if (!current || !this.validateCurrent(current)) {
        current = [LocationStore.keys().next().value];
      }

      this.setLocation(current);
      this.supported = true;
      this.loading = false;
    } catch (error) {
      logger.log(
        "The following message is not an Error, if you don't want to support multi location within your user adapter:"
      );
      logger.log(error);
      this.supported = false;
      this.loading = false;
    }

    this.waiting.forEach(async resolve => {
      resolve();
    });
  }

  wait() {
    logger.log("Method Call: wait()", this.loading);
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
      this.validateCurrent(ids),
      "Setting the current location failed. All ids must be in the list of locations."
    );

    this.current = ids.map(id => LocationStore.get(id));
    this.currentHash = newHash;

    logger.log(`Locations set (${this.currentHash})`);

    this.triggerObservers();

    $user.setCurrentLocations(ids).then(null, error => logger.error(error));
  }

  validateCurrent(current) {
    if (!_.isArray(current)) {
      return false;
    }

    let result = current
      .map(id => LocationStore.has(id))
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

  isChild(id) {
    return this.locationIsChild.includes(id);
  }
}
