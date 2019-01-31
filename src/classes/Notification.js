import { triggerDigestCycle } from "../services/nghelper.service";

export default class Notification {
  constructor(input) {
    this.watcher = [];

    let defaults = {
      show: true,
      focus: false,
      time: 5000
    };

    if (_.isString(input)) {
      _.defaults(this, { message: input }, defaults);
    }

    if (_.isObject(input)) {
      _.defaults(this, input, defaults);
    }

    if (this.time) {
      setTimeout(() => {
        this.close();

        triggerDigestCycle();
      }, this.time);
    }

    // TODO:
    // if (this.focus) {
    //   let overlay = $header.createOverlay();

    //   this.style = { "z-index": overlay.index + 1 };

    //   overlay.onClose(() => {
    //     if (this.show) {
    //       this.close();
    //     }
    //   });

    //   this.onClose(() => {
    //     overlay.close();
    //   });
    // }
  }

  close() {
    this.show = false;
    this.watcher.forEach(cb => cb());
  }

  onClose(callback) {
    if (!this.show) {
      callback();
      return;
    }

    this.watcher.push(callback);
  }
}
