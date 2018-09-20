import pathToRegexp from "path-to-regexp";

export default class OpenDashRoute {
  constructor(name, path, component) {
    this.name = name;
    this.path = path;
    this.component = component;
    this.keys = [];
    this.re = pathToRegexp(path, this.keys);
    this.toPath = pathToRegexp.compile(path);
  }

  test(path) {
    return this.re.test(path);
  }

  params(path) {
    let result = this.re.exec(path);

    let params = {};

    if (result) {
      this.keys.forEach((key, i) => {
        params[key.name] = result[i + 1];
      });
    }

    return params;
  }
}
