import lodash from "lodash";

export default class OpenDashConfig {
  constructor() {
    this.config = {};
  }

  get(key) {
    if (!lodash.isString(key)) {
      throw new Error("key must be a String");
    }

    let value = lodash.get(this.config, key);
    return value;
  }

  set(key, value) {
    if (!lodash.isString(key)) {
      throw new Error("key must be a String");
    }

    lodash.set(this.config, key, value);
  }

  merge(obj) {
    if (!lodash.isObject(obj)) {
      throw new Error("obj must be an Object");
    }

    lodash.merge(this.config, obj);
  }

  toJSON() {
    return this.config;
  }

  toString() {
    return (
      "OpenDashConfig: \n" +
      lodash
        .map(flatten(this.config), (value, key) => `- ${key}: ${value}`)
        .join("\n")
    );
  }
}

function flatten(object, separator = ".") {
  return Object.assign(
    {},
    ...(function _flatten(child, path = []) {
      return [].concat(
        ...Object.keys(child).map(
          key =>
            typeof child[key] === "object"
              ? _flatten(child[key], path.concat([key]))
              : { [path.concat([key]).join(separator)]: child[key] }
        )
      );
    })(object)
  );
}
