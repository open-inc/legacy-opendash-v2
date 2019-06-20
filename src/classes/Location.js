import _ from "lodash";

import Logger from "../helper/logger";

const logger = Logger("opendash/classes/Location");

const ChildrenStore = new WeakMap();

import LocationStore from "./LocationStore.js";

export default class OpenDashLocation {
  constructor(loc) {
    logger.assert(_.isObject(loc), "Each location must be an Object.");

    logger.assert(_.isObject(loc), "Each location must have an id attribute.");

    logger.assert(
      !LocationStore.has(loc.id),
      "Each location must have an uniq id attribute."
    );

    Object.assign(this, loc);
  }

  get children() {
    if (!ChildrenStore.has(this)) {
      return [];
    }

    return ChildrenStore.get(this).map(id => LocationStore.get(id));
  }

  set children(children) {
    if (children) {
      logger.assert(
        Array.isArray(children),
        "If a location has a children attribute, it must be an Array of Location ids."
      );

      ChildrenStore.set(this, children);
    }
  }
}
