import _ from "lodash";
import moment from "moment";
// import Map from "collections/map";

import Logger from "../helper/logger";

const logger = Logger("opendash/services/data");

import defaultIcon from "file-loader!../assets/default-item.svg";

let $timeout, $q, $user, $env, $location;

const $store = new Map();
const $root = [];

const waiting = [];
let globalready = false;
let valueValidation;
let adapters;

export default class OpenDashDataService {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    $q = $injector.get("$q");
    $timeout = $injector.get("$timeout");
    $user = $injector.get("opendash/services/user");
    $location = $injector.get("opendash/services/location");
    $env = $injector.get("opendash/services/env");

    valueValidation = $env("OD-DATA-VALIDATION", null, true);

    this.ready = globalready;

    adapters = $injector
      .get("od.adapter.register")
      .map(AdapterFactory => new AdapterFactory({}, { $user, $location }));

    const promises = adapters.map(adapter =>
      adapter.init(new OpenDashDataContext(adapter))
    );

    $q.all(promises)
      .then(() => {
        return $user.wait();
      })
      .then(() => {
        this.ready = true;
        waiting.forEach(resolve => resolve());
      });
  }

  get ready() {
    return globalready;
  }

  set ready(state) {
    globalready = state;
  }

  wait() {
    return $q((resolve, reject) => {
      if (this.ready) {
        resolve();
      } else {
        waiting.push(resolve);
      }
    });
  }

  list() {
    return [...$store.values()];
  }

  query(input) {
    return new OpenDashDataQuery(input || this.list());
  }

  listByType(type) {
    return _([...$store.values()])
      .map(item =>
        _.map(item.valueTypes, (v, k) => (v.type === type ? [item, k] : null))
      )
      .flatten()
      .pull(null)
      .value();
  }

  get(id) {
    return $store.get(id);
  }

  async emitMessage(type, payload) {
    let promises = adapters.map(a => a.onMessage(type, payload));

    try {
      await Promise.all(promises);
    } catch (error) {
      logger.warn(error);
    }
  }
}

class OpenDashDataQuery {
  constructor(list) {
    this.list = _.chain(list);
  }

  filter(func) {
    this.list = this.list.filter(func);
    return this;
  }

  union(input) {
    this.list = this.list.union(input);
    return this;
  }

  intersection(input) {
    this.list = this.list.intersection(input);
    return this;
  }

  difference(input) {
    this.list = this.list.difference(input);
    return this;
  }

  root() {
    return this.intersection($root);
  }

  container() {
    return this.filter(i => i instanceof OpenDashDataContainer);
  }

  items() {
    return this.filter(i => i instanceof OpenDashDataItem);
  }

  run() {
    return this.list.value();
  }
}

class OpenDashDataContainer {
  constructor(adapter, payload) {
    payload = payload || {};

    if (!payload.id) {
      throw new Error("Creating an OpenDashDataContainer requires an id.");
    }

    if (!payload.name) {
      throw new Error("Creating an OpenDashDataContainer requires a name.");
    }

    if (payload.parent && !_.isString(payload.parent)) {
      throw new Error(
        "Creating an OpenDashDataContainer with a parent requires the parent property to be a String which represents an OpenDashDataContainer/OpenDashDataItem IDs."
      );
    }

    this.adapter = adapter;

    this.id = payload.id;
    this.name = payload.name;
    this.owner = payload.owner;
    this.icon = payload.icon || defaultIcon;
    this.parent = $store.get(payload.parent) || null;
    this.path = [];

    if (this.parent) {
      if (this.parent.parent) {
        this.path = this.parent.path;
      }
      this.path.push(this.parent);
    }

    if (!this.parent) {
      $root.push(this);
    }

    this.meta = _.isObject(payload.meta) ? payload.meta : {};
  }

  get children() {
    return [...$store.values()].filter(x => x.parents.indexOf(this) >= 0);
  }

  get allChildren() {
    let result = _.flatten(this.children.map(child => child.allChildren));
    result = _.flatten([this.children, result]);
    result = _.pull(result, undefined);
    result = result.filter(item => item instanceof OpenDashDataItem);
    return result;
  }

  get parents() {
    return this.parent ? [this.parent] : [];
  }

  get items() {
    return _([...$store.values()])
      .filter(item => !(item instanceof OpenDashDataContainer))
      .filter(item => item.isParent(this))
      .value();
  }
}

class OpenDashDataItem {
  constructor(adapter, payload) {
    payload = payload || {};

    if (!payload.id) {
      throw new Error("Creating an OpenDashDataItem requires an id.");
    }

    if (!payload.name) {
      throw new Error("Creating an OpenDashDataItem requires a name.");
    }

    if (this.validateValueTypes(payload.valueTypes)) {
      throw new Error(
        "Creating an OpenDashDataItem requires valid value types."
      );
    }

    if (payload.parents && !_.isArray(payload.parents)) {
      throw new Error(
        "Creating an OpenDashDataItem with parent(s) requires the parents property to be an array of OpenDashDataContainer/OpenDashDataItem IDs."
      );
    }

    this.adapter = adapter;

    this.id = payload.id;
    this.name = payload.name;
    this.owner = payload.owner;
    this.icon = payload.icon || defaultIcon;
    this.parents = _(payload.parents || [])
      .map(x => $store.get(x))
      .pull(undefined)
      .value();

    if (this.parents.length === 0) {
      $root.push(this);
    }

    this.valueTypes = payload.valueTypes;

    this.meta = _.isObject(payload.meta) ? payload.meta : {};

    this.value = null;

    this.watchers = [];

    if (payload.value) {
      this.set("value", payload.value).then(null, err =>
        logger.error(
          "OpenDashDataItem Creation Error: Value Could Not Be Set: ",
          err
        )
      );
    }
  }

  get children() {
    return [...$store.values()].filter(x => x.parents.indexOf(this) >= 0);
  }

  getAllChildren(all) {
    let result = _.flatten(this.children.map(child => child.allChildren));
    result = _.flatten([this.children, result]);
    result = _.pull(result, undefined);
    result = result.filter(item => item instanceof OpenDashDataItem);
    return result;
  }

  isParent(input) {
    if (this.parents) {
      for (let parent of this.parents) {
        if (parent === input) {
          return true;
        }

        if (parent.parent && parent.path.indexOf(input) >= 0) {
          return true;
        }
      }
    }

    return false;
  }

  set(key, value, saveToDataAdapter, saveToUserAdapter) {
    if (saveToDataAdapter) {
      return $q.resolve(
        this.adapter.update(new OpenDashDataContext(this.adapter), {
          id: this.id,
          key,
          value
        })
      );
    }

    if (saveToUserAdapter) {
      key = null;
    }

    if (key === "name" && value) {
      if (!_.isString(value)) {
        return $q.reject(
          new Error("OpenDashDataItem Update Error: Invalid name.")
        );
      }

      let old = this.name;
      this.name = value;

      this.notify("name", this.name, old);

      return $q.resolve(true);
    }

    if (key === "value" && value) {
      if (valueValidation && !this.validateValue(value, true)) {
        return $q.reject(
          new Error("OpenDashDataItem Update Error: Invalid value.")
        );
      }

      let newValue = {
        date: value.date,
        value: value.value
      };

      let oldValue = this.value;
      this.value = newValue;
      this.notify("value", newValue, oldValue);

      return $q.resolve(true);
    }

    return $q.reject(
      new Error(
        "[opendash/services/data] Unknown OpenDashDataItem Update Error."
      )
    );
  }

  validateValueTypes(valueTypes) {
    const types = ["String", "Number", "Boolean", "Geo", "Object"];

    if (!valueTypes) {
      throw new Error(
        "[opendash/services/data] OpenDashDataItem: Invalid property valueTypes. You need to have a valueTypes property in the payload Object when creating a new OpenDashDataItem."
      );
    }

    if (!_.isArray(valueTypes)) {
      throw new Error(
        "[opendash/services/data] OpenDashDataItem: Invalid property valueTypes: Must be an array."
      );
    }

    if (valueTypes.length === 0) {
      throw new Error(
        "[opendash/services/data] OpenDashDataItem: Invalid property valueTypes: Must have at least one type. If your item does not have any values, consider using an Container instead."
      );
    }

    valueTypes.forEach(x => {
      if (!_.isObject(x) || !x.name || !x.type) {
        throw new Error(
          "[opendash/services/data] OpenDashDataItem: Invalid property valueTypes: Each type needs to be an object with a name and type property."
        );
      }

      if (types.indexOf(x.type) < 0) {
        throw new Error(
          `[opendash/services/data] OpenDashDataItem: Invalid property valueTypes: Unsupported type. Must be one of [${types.join(
            ", "
          )}]`
        );
      }
    });
  }

  validateValue(value, log) {
    if (!(value.date && _.isNumber(value.date))) {
      if (log)
        logger.error(
          "OpenDashDataItem: Bad Value: A value requires a valid date property, which is a Unix Millisecond Timestamp/Number."
        );
      return false;
    }

    let v = value.value;
    let vt = this.valueTypes;

    if (!_.isArray(value.value) || v.length !== vt.length) {
      if (log)
        logger.error(
          "OpenDashDataItem: Bad Value: A value requires a valid value array."
        );
      return false;
    }

    for (let i = 0; i < v.length; i++) {
      if (vt[i].type === "String" && !_.isString(v[i])) {
        if (log)
          logger.error(
            `OpenDashDataItem: Bad Value: Value ${i} should be a String but is ${
              v[i]
            }`
          );
        return false;
      }

      if (vt[i].type === "Number" && !_.isNumber(v[i])) {
        if (log)
          logger.error(
            `OpenDashDataItem: Bad Value: Value ${i} should be a Number but is ${
              v[i]
            }`
          );
        return false;
      }

      if (vt[i].type === "Boolean" && !_.isBoolean(v[i])) {
        if (log)
          logger.error(
            `OpenDashDataItem: Bad Value: Value ${i} should be a Boolean but is ${
              v[i]
            }`
          );
        return false;
      }

      if (vt[i].type === "Geo" && !_.isObject(v[i])) {
        if (log)
          logger.error(
            `OpenDashDataItem: Bad Value: Value ${i} should be a Geo JSON Object but is ${
              v[i]
            }`
          );
        return false;
      }

      if (vt[i].type === "Object" && !_.isObject(v[i])) {
        if (log)
          logger.error(
            `OpenDashDataItem: Bad Value: Value ${i} should be a Object but is ${
              v[i]
            }`
          );
        return false;
      }
    }

    return true;
  }

  watch(callback) {
    this.watchers.push(callback);
  }

  notify(event, newValue, oldValue) {
    this.watchers.forEach(callback => {
      callback(event, newValue, oldValue);
    });
  }

  value() {
    let response = _.head(this.values);
    return response
      ? $q.resolve(response)
      : $q.reject(
          new Error(
            "[opendash/services/data] OpenDashDataItem.value(): Item currently has no value."
          )
        );
  }

  liveValues(callback) {
    if (this.value) {
      $timeout(() => {
        callback(this.value);
      });
    }

    this.watch((key, newValue, oldValue) => {
      if (key === "value") {
        $timeout(() => {
          callback(newValue);
        });
      }
    });
  }

  history(options) {
    options = options || {};

    // if (!options.aggregation) {
    //   throw new Error('[opendash/services/data] OpenDashDataItem.history(): Bad usage in options: aggregation');
    // }

    if (options.aggregation && !_.isNumber(options.aggregation)) {
      switch (options.aggregation) {
        case "y":
        case "year":
        case "years":
          options.aggregation = "year";
          break;
        case "Q":
        case "quarter":
        case "quarters":
          options.aggregation = "quarter";
          break;
        case "M":
        case "month":
        case "months":
          options.aggregation = "month";
          break;
        case "w":
        case "week":
        case "weeks":
          options.aggregation = "week";
          break;
        case "d":
        case "day":
        case "days":
          options.aggregation = "day";
          break;
        case "h":
        case "hour":
        case "hours":
          options.aggregation = "hour";
          break;
        case "m":
        case "minute":
        case "minutes":
          options.aggregation = "minute";
          break;
        case "s":
        case "second":
        case "seconds":
          options.aggregation = "second";
          break;
        case "ms":
        case "millisecond":
        case "milliseconds":
          options.aggregation = "millisecond";
          break;
        default:
          throw new Error(
            "[opendash/services/data] OpenDashDataItem.history(): Bad usage in options: aggregation"
          );
      }
    }

    if (options.start && options.end) {
      options.start = moment(options.start);
      options.end = moment(options.end);
      options.since = null;
      options.value = null;
      options.unit = null;

      if (!options.start.isValid()) {
        throw new Error(
          "[opendash/services/data] OpenDashDataItem.history(): Bad usage in options: moment(start).isValid()"
        );
      }

      if (!options.end.isValid()) {
        throw new Error(
          "[opendash/services/data] OpenDashDataItem.history(): Bad usage in options: moment(end).isValid()"
        );
      }
    } else if (options.since) {
      options.start = null;
      options.end = null;
      options.since = moment(options.since);
      options.value = null;
      options.unit = null;

      if (!options.since.isValid()) {
        throw new Error(
          "[opendash/services/data] OpenDashDataItem.history(): Bad usage in options: moment(since).isValid()"
        );
      }
    } else if (_.isNumber(options.value) && _.isString(options.unit)) {
      options.start = null;
      options.end = null;
      options.since = moment().subtract(options.value, options.unit);
      options.value = null;
      options.unit = null;
    } else {
      throw new Error(
        "[opendash/services/data] OpenDashDataItem.history(): Bad usage in options.history."
      );
    }

    options.id = this.id;

    return $q
      .resolve(
        this.adapter.history(new OpenDashDataContext(this.adapter), options)
      )
      .then(data => {
        if (!_.isArray(data)) {
          logger.error(
            "OpenDashDataItem.history(): Bad response from Data Adapter, must be an Array."
          );
          return [];
        }

        if (valueValidation) {
          let length = valueValidation === "sample" ? 1 : data.length;
          for (let i = 0; i < length; i++) {
            let element = data[i];
            if (!this.validateValue(element, true)) {
              return [];
            }
          }
        }

        return data;
      });
  }
}

class OpenDashDataContext {
  constructor(adapter) {
    this.adapter = adapter;
  }

  get(id) {
    return $store.get(id);
  }

  create(payload, update) {
    let oldItem = $store.get(payload.id);
    let newItem = new OpenDashDataItem(this.adapter, payload);
    if (update && oldItem != null) {
      oldItem.notify("name", newItem.name, oldItem.name);
    }
    $store.set(payload.id, newItem);
  }

  createContainer(payload) {
    $store.set(payload.id, new OpenDashDataContainer(this.adapter, payload));
  }

  clear() {
    $store.clear();
  }
  update(operation) {
    globalready = false;
    operation.then(() => {
      globalready = true;
      $q.resolve();
    });
  }
}
