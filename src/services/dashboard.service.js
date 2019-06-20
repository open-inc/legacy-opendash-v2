import OpenDashDashboard from "../classes/Dashboard";

import Observable from "../helper/observable.class";
import Logger from "../helper/logger";

import $user from "../services/user.service";
import $location from "../services/location.service";

const logger = Logger("opendash/services/dashboard");

let $event;
let $notification;
let $env;
let $modal;

let $timeout;
let $scope;
let $q;

const version = 2;

let DASHBOARDS_BY_LOCATION = false;

export default class Dashboard {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    $event = $injector.get("opendash/services/event");
    $notification = $injector.get("opendash/services/notification");
    $env = $injector.get("opendash/services/env");
    $modal = $injector.get("opendash/services/modal");

    $timeout = $injector.get("$timeout");
    $scope = $injector.get("$rootScope");
    $q = $injector.get("$q");

    DASHBOARDS_BY_LOCATION = $env("OD-DASHBOARDS-BY-LOCATION", null, false);

    this.widgetActions = [];

    this.meta = undefined;
    this.dashboards = [];

    this.init();
    this.initOnce();
    this.initGridsterConfig();
    this.initWidgetResizeEvent();

    if (DASHBOARDS_BY_LOCATION) {
      $location.onChange(() => this.init());
    }
  }

  get data() {
    logger.error("$dashboard.data (get) is depricated.");
    return null;
  }

  set data(value) {
    logger.error("$dashboard.data (set) is depricated.");
  }

  get ls() {
    // load old value:
    if (window.localStorage.getItem("od.dashboard.service-current-dashboard")) {
      this.ls = window.localStorage.getItem(
        "od.dashboard.service-current-dashboard"
      );
      window.localStorage.removeItem("od.dashboard.service-current-dashboard");
    }
    return (
      window.localStorage.getItem("opendash/services/dashboard::current") ||
      null
    );
  }

  set ls(value) {
    window.localStorage.setItem("opendash/services/dashboard::current", value);
  }

  get editMode() {
    return (
      this.gridsterConfig.draggable.enabled &&
      this.gridsterConfig.resizable.enabled
    );
  }

  set editMode(value) {
    if (this.editMode === value) {
      return;
    }

    this.gridsterConfig.draggable.enabled = value;
    this.gridsterConfig.resizable.enabled = value;

    $event.emit("od-dashboard-editmode-toggle");

    if (value) {
      $event.emit("od-dashboard-editmode-enabled");
    } else {
      $event.emit("od-dashboard-editmode-disabled");
    }
  }

  async init() {
    if (this.initializing) return;
    this.initializing = true;
    this.ready = false;

    try {
      await $user.wait();
      await $location.wait();

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
          let id = await $user.createDashboard(
            new OpenDashDashboard({
              name,
              widgets: this.meta.dashboards[name].widgets
            })
          );

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

      // get current location
      let location = await $location.currentHash;

      // get all dashboards
      let dashboards = await $user.listDashboards();

      // Check if there are no dashboards
      if (dashboards.length === 0) {
        dashboards[0] = await $user.createDashboard(
          new OpenDashDashboard({
            name: "Home",
            location
          }).toJSON()
        );
      }

      // load all dashboards
      dashboards = await Promise.all(
        dashboards.map(id => $user.getDashboard(id))
      );

      // Create instances of OpenDashDashboard from the dashboards
      dashboards.map(dashboard => new OpenDashDashboard(dashboard));

      // Filter dashboards by location
      if (DASHBOARDS_BY_LOCATION && location && location[0]) {
        dashboards = dashboards.filter(
          dashboard => dashboard.location === location
        );

        // Check if there still dashboards
        if (dashboards.length === 0) {
          dashboards[0] = await $user.createDashboard(
            new OpenDashDashboard({
              name: "Home",
              location
            }).toJSON()
          );

          dashboards = await Promise.all(
            dashboards.map(id => $user.getDashboard(id))
          );

          // Create instances of OpenDashDashboard from the dashboards
          dashboards.map(dashboard => new OpenDashDashboard(dashboard));
        }
      }

      this.dashboards = dashboards;

      // get the id of the current dashboard
      let cid = this.ls || this.meta.default;

      let current = this.dashboards.find(d => d.id === cid);

      if (!current) {
        current = this.dashboards[0];
      }

      logger.assert(current, `No dashboard found.`);

      this.current = new OpenDashDashboard(current);

      this.observable = new Observable(this.current);

      this.observable.onChange(() => {
        $event.emit("od-dashboard-changed");
        $event.emit("od-widgets-changed");
      });

      this.ls = current.id;

      logger.log(
        `Dashboard selected: ${this.current.name} (${this.current.id})`
      );

      this.ready = true;

      $event.emit("od-dashboard-ready");

      await $q.resolve();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.init");
      await $q.resolve();
    }

    this.initializing = false;
  }

  async initOnce() {
    try {
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
      let location = $location.currentHash;
      let dashboard = new OpenDashDashboard({ name, location });
      this.ls = await $user.createDashboard(dashboard);

      this.init();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.create");
    }
  }

  async editCurrentDashboard() {
    try {
      await $modal.open({
        component: "od-dashboard-edit-modal"
      });
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.save");
    }
  }

  async createDashboardFromConfig(config) {
    try {
      let id = null;
      let location = $location.currentHash;

      config = Object.assign({}, config, { id, location });

      console.log();

      let dashboard = new OpenDashDashboard(config);

      this.ls = await $user.createDashboard(dashboard);

      this.init();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.create");
    }
  }

  async createDashboardFromConfigDialog(config) {
    try {
      let id = null;
      let name = await $modal.prompt(
        "od.header.dashboards.create_prompt",
        this.current.name
      );

      if (!name) {
        return;
      }

      let dashboard = Object.assign({}, config, {
        id,
        name
      });

      console.log(dashboard);

      this.createDashboardFromConfig(dashboard);
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.create");
    }
  }

  async copyCurrentDashboardDialog() {
    try {
      let id = null;
      let name = await $modal.prompt(
        "od.header.dashboards.create_prompt",
        this.current.name
      );

      if (!name) {
        return;
      }

      let dashboard = Object.assign({}, this.current.toJSON(), { id, name });

      console.log(dashboard);

      this.createDashboardFromConfig(dashboard);
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.create");
    }
  }

  async changeDashboard(id) {
    try {
      if (id === this.ls) return;
      this.ls = id;

      this.init();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.change");
    }
  }

  async deleteCurrentDashboard() {
    try {
      await $user.deleteDashboard(this.current.id);

      this.init();
    } catch (error) {
      logger.error(error);
      $notification.danger("od.dashboard.errors.delete");
    }
  }

  setDashboardOnEmptyAction(action) {
    this.dashboardOnEmptyActionOverwrite = action;
  }

  addWidgetAction(action) {
    this.widgetActions.push(action);
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
    $event.on(["od-widgets-resize", "od-widgets-changed"], () => {
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

  async save() {
    try {
      await $user.setDashboard(this.current);
      $event.emit("od-dashboard-save");
      return true;
    } catch (error) {
      $notification.danger("od.dashboard.errors.save");
      logger.error(error);
      return false;
    }
  }
}
