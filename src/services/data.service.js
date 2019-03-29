import _ from "lodash";
import moment from "moment";

import Logger from "../helper/logger";

const logger = Logger("opendash/services/data");

import $user from "../services/user.service";
import $location from "../services/location.service";
import $env from "../services/env.service";

const defaultIcon = null;

const $store = new Map();
const $watcherStore = new Map();
const $root = [];

const waiting = [];
let globalready = false;
let adapters;
let NameMap = {};

export default class OpenDashDataService {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    adapters = $injector
      .get("od.adapter.register")
      .map(([AdapterFactory, cfg]) => {
        return new AdapterFactory(cfg, { $user, $location });
      });

    let LOCK = false;

    const init = async () => {
      if (LOCK) {
        return;
      }

      LOCK = true;

      this.ready = false;

      $store.clear();

      NameMap = (await $user.getData("settings:data:names")) || {};

      const promises = adapters.map(adapter =>
        adapter.init(new OpenDashDataContext(adapter))
      );

      await Promise.all(promises);

      this.ready = true;
      waiting.forEach(resolve => resolve());
      waiting.length = 0;

      LOCK = false;
    };

    init();

    $location.onChange(async () => {
      init();
    });
  }

  set NameMap(value) {
    NameMap = value;
  }

  get ready() {
    return globalready;
  }

  set ready(state) {
    globalready = state;
  }

  wait() {
    return new Promise((resolve, reject) => {
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

  listByType(types) {
    if (_.isString(types)) {
      types = [types];
    }

    logger.assert(
      _.isArray(types),
      "listByTypes(type) - type must be a String or an Array of Strings"
    );

    return _([...$store.values()])
      .map(item =>
        _.map(
          item.valueTypes,
          (v, k) => (types.includes(v.type) ? [item, k] : null)
        )
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

  toJSON() {
    return _.pick(this, ["id", "name", "owner", "meta"]);
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
    this._name = payload.name;
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

    if (!$watcherStore.has(this.id)) {
      $watcherStore.set(this.id, []);
    }

    if (payload.value) {
      this.set("value", payload.value).then(null, err =>
        logger.error(
          "OpenDashDataItem Creation Error: Value Could Not Be Set: ",
          err
        )
      );
    }
  }

  get name() {
    try {
      return NameMap[this.id] || this._name;
    } catch (error) {
      return this._name;
    }
  }

  get isCustomName() {
    return NameMap[this.id];
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
      return Promise.resolve(
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
        return Promise.reject(
          new Error("OpenDashDataItem Update Error: Invalid name.")
        );
      }

      let old = this.name;
      this.name = value;

      this.notify("name", this.name, old);

      return Promise.resolve(true);
    }

    if (key === "value" && value) {
      if (
        $env("OD-DATA-VALIDATION", null, true) &&
        !this.validateValue(value, true)
      ) {
        return Promise.reject(
          new Error("OpenDashDataItem Update Error: Invalid value.")
        );
      }

      if (this.value && this.value.date >= value.date) {
        return Promise.resolve(false);
      }

      let newValue = {
        date: value.date,
        value: value.value
      };

      let oldValue = this.value;
      this.value = newValue;
      this.notify("value", newValue, oldValue);

      return Promise.resolve(true);
    }

    return Promise.reject(
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
          "[opendash/services/data] OpenDashDataItem: Invalid property valueTypes: Each type needs to be an object with a name, type and possibly unit property."
        );
      }

      logger.assert(
        _.isString(x.name),
        "OpenDashDataItem: Invalid property valueTypes: type.name must be a String"
      );

      logger.assert(
        types.includes(x.type),
        `OpenDashDataItem: Invalid property valueTypes: Unsupported type. Must be one of [${types.join(
          ", "
        )}]`
      );

      if (x.unit) {
        logger.assert(
          _.isString(x.unit),
          "OpenDashDataItem: Invalid property valueTypes: type.unit must be a String"
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
    $watcherStore.get(this.id).push(callback);
  }

  notify(event, newValue, oldValue) {
    $watcherStore.get(this.id).forEach(callback => {
      callback(event, newValue, oldValue);
    });
  }

  value() {
    let response = _.head(this.values);
    return response
      ? Promise.resolve(response)
      : Promise.reject(
          new Error(
            "[opendash/services/data] OpenDashDataItem.value(): Item currently has no value."
          )
        );
  }

  liveValues(callback) {
    if (this.value) {
      Promise.resolve().then(() => {
        callback(this.value);
      });
    }

    this.watch((key, newValue, oldValue) => {
      if (key === "value") {
        Promise.resolve().then(() => {
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

    return Promise.resolve(
      this.adapter.history(new OpenDashDataContext(this.adapter), options)
    ).then(data => {
      if (!_.isArray(data)) {
        logger.error(
          "OpenDashDataItem.history(): Bad response from Data Adapter, must be an Array."
        );
        return [];
      }

      if ($env("OD-DATA-VALIDATION", null, true)) {
        let length =
          $env("OD-DATA-VALIDATION", null, true) === "sample" ? 1 : data.length;
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

  toJSON() {
    return _.pick(this, ["id", "name", "owner", "meta", "valueTypes"]);
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

  clear() {}

  update(operation) {
    globalready = false;
    operation.then(() => {
      globalready = true;
      Promise.resolve();
    });
  }
}
