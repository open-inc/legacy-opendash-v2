export default class Observable {
  constructor(object) {
    this.callbacks = [];
    this.object = object;
    this.objectOld = this.serialize();

    this.init();
  }

  init() {
    setInterval(() => {
      this.check();
    }, 1000);
  }

  onChange(callback) {
    this.callbacks.push(callback);
  }

  check() {
    let cur = this.serialize();

    if (this.objectOld !== cur) {
      this.notify();
      this.objectOld = cur;
    }
  }

  serialize() {
    return JSON.stringify(this.object);
  }

  notify() {
    this.callbacks.forEach(callback => callback());
  }
}
