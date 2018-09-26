/*eslint no-console: ["off"] */

export default class OpenDashConfig {
  constructor(namespace) {
    this.namespace = namespace;
  }

  log(...args) {
    console.log(`[${this.namespace}]`, ...args);
  }

  warn(...args) {
    console.warn(`[${this.namespace}]`, ...args);
  }

  error(...args) {
    console.error(`[${this.namespace}]`, ...args);
  }

  assert(condition = false, message = "Error") {
    if (!condition) {
      throw new Error(`[${this.namespace}] ${message}`);
    }
  }
}
