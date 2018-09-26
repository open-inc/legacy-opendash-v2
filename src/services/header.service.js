import _ from "lodash";
import defaultLogo from "../assets/opendash.png";

import Logger from "../helper/logger";

const logger = Logger("opendash/services/header");

let $event;
let $router;

export default class HeaderService {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    $event = $injector.get("opendash/services/event");
    $router = $injector.get("opendash/services/router");

    this.overlayClose;
    this.sidebar = {};
    this.sidebarFooter = [];
    this.topbar = [];
    this.logo = {
      url: defaultLogo,
      action: () => {
        $router.go("/");
      }
    };

    this.overlays = [];
    this.overlayIndex = 5000;

    this.navOverlay = this.createOverlay(true, false);

    this.navOverlay.onOpen(() => {
      $event.emit("od-header-overlay-open");
    });

    this.navOverlay.onClose(() => {
      $event.emit("od-header-overlay-close");
    });
  }

  get overlay() {
    return this.navOverlay && this.navOverlay.active;
  }

  addLogo(url, action) {
    if (url && _.isString(url)) {
      this.logo.url = url;
    }
    if (action && _.isFunction(action)) {
      this.logo.action = action;
    }
  }

  addSidebarItem(input) {
    const defaultAction = () => {};

    input.group = input.group || "Neue Gruppe";

    if (!this.sidebar[input.group] && input.group !== "footer") {
      this.sidebar[input.group] = [];
    }

    const item = {
      hidden: false,
      icon: input.icon || null,
      text: input.text || "Neuer Eintrag",
      action: input.action || defaultAction,
      overlay: input.overlay || false
    };

    if (input.group === "footer") {
      this.sidebarFooter.push(item);
    } else {
      this.sidebar[input.group].push(item);
    }

    return item;
  }

  addTopbarItem(input) {
    const defaultAction = () => {};

    const item = {
      hidden: false,
      icon: input.icon || "",
      action: input.action || defaultAction,
      active: false
    };

    this.topbar.push(item);

    return item;
  }

  setOverlay(input) {
    logger.warn("Depricated: [opendash/services/header] setOverlay()"); // eslint-disable-line

    if (input) {
      this.navOverlay.open();
    } else {
      this.navOverlay.close();
    }
  }

  onOverlayOpen(fn) {
    logger.warn("Depricated: [opendash/services/header] onOverlayOpen()"); // eslint-disable-line

    $event.on("od-header-overlay-open", fn);
  }

  onOverlayClose(fn) {
    logger.warn("Depricated: [opendash/services/header] onOverlayClose()"); // eslint-disable-line

    $event.on("od-header-overlay-close", fn);
  }

  createOverlay(focus = false, active = true) {
    let overlay = new OpenDashOverlay(this.overlayIndex, active);

    if (focus) {
      overlay.onOpen(() => {
        this.overlays.forEach(o => {
          if (o !== overlay) {
            o.close();
          }
        });
      });
    }

    if (active) {
      overlay.open();
    }

    this.overlays.push(overlay);
    this.overlayIndex += 10;

    return overlay;
  }
}

class OpenDashOverlay {
  constructor(index) {
    this.active = false;
    this.index = index;

    this.openWatcher = [];
    this.closeWatcher = [];
  }

  open() {
    if (this.active) {
      this.close();
    }

    this.active = true;
    this.openWatcher.forEach(cb => cb());
  }

  close() {
    if (this.active) {
      this.active = false;
      this.closeWatcher.forEach(cb => cb());
    }
  }

  toggle() {
    if (this.active) {
      this.close();
    } else {
      this.open();
    }
  }

  onOpen(callback) {
    if (this.active) {
      callback();
    }

    this.openWatcher.push(callback);
  }

  onClose(callback) {
    if (!this.active) {
      callback();
    }

    this.closeWatcher.push(callback);
  }
}
