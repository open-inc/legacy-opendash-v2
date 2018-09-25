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
    this.locations = [];

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

      if (!current) {
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

    let locations = ids.map(id =>
      this.locations.find(location => location.id === id)
    );

    locations.forEach(location => {
      logger.assert(
        location,
        "Setting the current location failed. All ids must be in the list of locations."
      );
    });

    logger.log(`Locations set (${ids.join(",")})`);

    this.current = locations;

    this.observer.forEach(async observer => observer(this.current));

    $user.setCurrentLocations(ids).then(null, error => logger.error(error));
  }

  onChange(observer) {
    if (_.isFunction(observer)) {
      this.observer.push(observer);

      if (this.current) {
        observer(this.current);
      }
    }
  }
}
