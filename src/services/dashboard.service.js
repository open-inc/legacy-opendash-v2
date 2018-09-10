import _ from "lodash";

import OpenDashDashboard from "../classes/Dashboard";
import OpenDashDashboardStore from "../classes/DashboardStore";
import OpenDashWidget from "../classes/Widget";

import Observable from "../helper/observable.class";
import Logger from "../helper/logger";

const logger = Logger("opendash/services/dashboard");

let reload = true;

let $user;
let $event;
let $env;
let $notification;

let $timeout;
let $scope;
let $q;

const version = 2;

export default class Dashboard {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    $user = $injector.get("opendash/services/user");
    $event = $injector.get("opendash/services/event");
    $env = $injector.get("opendash/services/env");
    $notification = $injector.get("opendash/services/notification");
    $timeout = $injector.get("$timeout");
    $scope = $injector.get("$rootScope");
    $q = $injector.get("$q");

    reload = $env("OD-DASHBOARD-RELOAD", null, true);

    this.widgetActions = [];

    this.meta = undefined;
    this.dashboards = [];

    this.init();
    this.initGridsterConfig();
    this.initWidgetResizeEvent();
  }

  get data() {
    logger.error("$dashboard.data (get) is depricated.");
    return null;
  }

  set data(value) {
    logger.error("$dashboard.data (set) is depricated.");
  }

  get ls() {
    return (
      window.localStorage.getItem("od.dashboard.service-current-dashboard") ||
      null
    );
  }

  set ls(value) {
    window.localStorage.setItem(
      "od.dashboard.service-current-dashboard",
      value
    );
  }

  async init() {
    try {
      await $user.wait();

      this.meta = await $user.getData("dashboard");

      // On fresh start:
      if (!this.meta) {
        this.meta = { version };

        await $user.setData("dashboard", this.meta);
      }

      // Backwards compatibility v1 -> v2
      if (!this.meta.version || this.meta.version === 1) {
        let dashboards = [];
        let def = null;

        for (let name of Object.keys(this.meta.dashboards)) {
          let id = await $user.createDashboard({
            name,
            widgets: this.meta.dashboards[name].widgets
          });

          if (name === this.meta.default) {
            def = id;
          }

          dashboards.push(id);
        }

        this.meta = {
          version: 2,
          default: def,
          dashboards
        };

        await $user.setData("dashboard", this.meta);
      }

      let dashboards = await $user.listDashboards();

      // Check if there are no dashboards
      if (dashboards.length === 0) {
        await $user.createDashboard({ name: "Home" });
        dashboards = await $user.listDashboards();
      }

      // load the all dashboards
      this.dashboards = await Promise.all(
        dashboards.map(id => $user.getDashboard(id))
      );

      // get the id of the current dashboard
      let cid = this.ls || this.meta.default;

      let current = this.dashboards.find(d => d.id === cid);

      if (!current) {
        current = this.dashboards[0];
      }

      logger.assert(current, `No dashboard found.`);

      this.current = new OpenDashDashboard(current);

      this.ls = current.id;

      logger.log(
        `Dashboard selected: ${this.current.name} (${this.current.id})`
      );

      this.ready = true;

      $event.emit("od-dashboard-ready");

      this.observable = new Observable(this.current);

      this.observable.onChange(() => {
        $event.emit("od-dashboard-changed");
        $event.emit("od-widgets-changed");
      });

      $event.on(
        [
          "od-dashboard-changed",
          "od-widgets-created",
          "od-widgets-removed",
          "od-dashboard-editmode-disabled"
        ],
        () => {
          this.save();
        }
      );

      await $q.resolve();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.init");
      await $q.resolve();
    }
  }

  async createDashboard(name) {
    try {
      this.ls = await $user.createDashboard({ name });
      if (reload) location.reload();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.create");
    }
  }

  async changeDashboard(id) {
    try {
      if (id === this.ls) return;
      this.ls = id;
      if (reload) location.reload();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.change");
    }
  }

  async deleteCurrentDashboard() {
    try {
      await $user.deleteDashboard(this.current.id);

      if (reload) location.reload();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.delete");
    }

    let currentDashboard = this.ls || this.data.default;

    logger.log(`Dashboard selected: ${currentDashboard}`);

    this.data.current = currentDashboard;

    this.ready = true;

    $event.emit("od-dashboard-ready");

    this.observable = new Observable(this.data);

    this.observable.onChange(() => {
      $event.emit("od-dashboard-changed");
      $event.emit("od-widgets-changed");
    });

    $event.on(
      [
        "od-dashboard-changed",
        "od-widgets-created",
        "od-widgets-removed",
        "od-dashboard-editmode-disabled"
      ],
      () => {
        this.save();
      }
    );
  }

  setDashboardOnEmptyAction(action) {
    this.dashboardOnEmptyActionOverwrite = action;
  }

  initGridsterConfig() {
    // https://github.com/ManifestWebDesign/angular-gridster#configuration

    this.gridsterConfig = {
      columns: 12,
      margins: [20, 20],
      outerMargin: false,
      pushing: true,
      floating: true,
      mobileBreakPoint: 600,
      minSizeX: 2,
      maxSizeX: null,
      minSizeY: 2,
      maxSizeY: null,
      draggable: {
        enabled: false,
        handle: "od-widget-header"
      },
      resizable: {
        enabled: false,
        handles: ["n", "e", "s", "w", "se", "sw"],
        stop: function(event, $element, widget) {
          $event.emit("od-widgets-resize");
          $timeout(() => {
            if (
              navigator.userAgent.indexOf("MSIE") !== -1 ||
              navigator.appVersion.indexOf("Trident/") > 0
            ) {
              let evt = document.createEvent("UIEvents");
              evt.initUIEvent("resize", true, false, window, 0);
              window.dispatchEvent(evt);
            } else {
              window.dispatchEvent(new Event("resize"));
            }
          }, 200);
        }
      }
    };

    this.gridsterItemConfig = {
      sizeX: "widget.grid[0]",
      sizeY: "widget.grid[1]",
      row: "widget.grid[2]",
      col: "widget.grid[3]"
    };
  }

  initWidgetResizeEvent() {
    // $(window).resize(event => {
    //   $event.emit('od-widgets-resize');
    // });

    $event.on(["od-widgets-resize", "od-widgets-changed"], () => {
      //logger.log("RESIZE");
      if (
        navigator.userAgent.indexOf("MSIE") !== -1 ||
        navigator.appVersion.indexOf("Trident/") > 0
      ) {
        let evt = document.createEvent("UIEvents");
        evt.initUIEvent("resize", true, false, window, 0);
        window.dispatchEvent(evt);
      } else {
        window.dispatchEvent(new Event("resize"));
      }
    });

    $scope.$on("gridster-resized", (sizes, gridster) => {
      $event.emit("od-widgets-resize");
    });

    $scope.$on("gridster-item-resized", item => {
      $event.emit("od-widgets-resize");
    });
  }

  addWidget(widget) {
    this.current.addWidget(widget);
    $event.emit("od-widgets-created");
    return true;
  }

  removeWidget(widget) {
    this.current.removeWidget(widget);
    $event.emit("od-widgets-removed");
    return true;
  }

  removeAllWidgets() {
    this.current.removeAllWidgets();
    $event.emit("od-widgets-removed");
    return true;
  }

  toggleEditMode() {
    const isEditMode = this.getEditMode();

    if (isEditMode) {
      if (
        navigator.userAgent.indexOf("MSIE") !== -1 ||
        navigator.appVersion.indexOf("Trident/") > 0
      ) {
        let evt = document.createEvent("UIEvents");
        evt.initUIEvent("resize", true, false, window, 0);
        window.dispatchEvent(evt);
      } else {
        window.dispatchEvent(new Event("resize"));
      }
    }

    this.gridsterConfig.draggable.enabled = !isEditMode;
    this.gridsterConfig.resizable.enabled = !isEditMode;

    $event.emit("od-dashboard-editmode-toggle");

    if (this.gridsterConfig.draggable.enabled) {
      $event.emit("od-dashboard-editmode-enabled");
    } else {
      $event.emit("od-dashboard-editmode-disabled");
    }
  }

  getEditMode() {
    return (
      this.gridsterConfig.draggable.enabled &&
      this.gridsterConfig.resizable.enabled
    );
  }

  save() {
    return $user.setDashboard(this.current).then(data => {
      $event.emit("od-dashboard-save");
      return true;
    });
  }
}
