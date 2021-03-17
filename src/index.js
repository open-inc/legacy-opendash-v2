import "./vendor";
import "javascript-detect-element-resize";
import angular from "angular";
import "angular-gridster";

import classes from "../classes";

import angularTranslate from "angular-translate";

import _ from "lodash";
import moment from "moment";

import services from "./services";

import $user from "./services/user.service";

import components from "./components";
import config from "./config";

import Logger from "./helper/logger";

import * as Highcharts from "highcharts/highstock";

import envService from "./services/env.service";
import routerService from "./services/router.service";

import * as ngHelper from "./services/nghelper.service";

const logger = Logger("opendash/core");

const docs = "http://docs.opendash.de";

let instanceStarted = false;

let ngModule = null;
let ngDependencies = [angularTranslate, "gridster"];

class openDASH {
  constructor() {
    this.plugins = [];
    this.translations = [];
    this.userAdapter = null;
    this.dataAdapters = [];
    this.widgetPresets = [];
  }

  get classes() {
    return classes;
  }

  get module() {
    if (!ngModule) {
      throw new Error(
        `You need to call instance.start() before getting the angular module, see ${docs}`
      );
    }

    return ngModule;
  }

  get router() {
    return routerService;
  }

  get env() {
    return envService;
  }

  get name() {
    if (!instanceStarted) {
      throw new Error(
        `You need to call instance.start() before getting the name, see ${docs}`
      );
    }

    return this.module.name;
  }

  init(options = {}) {
    if (ngModule) {
      throw new Error(
        `You need to call instance.init() before calling any other method, see ${docs}`
      );
    }

    if (options.dependencies) {
      this.registerAngularDependency(options.dependencies);
    }
  }

  registerUserAdapter(adapter, options = {}) {
    this.userAdapter = new adapter(options);
  }

  registerDataAdapter(adapter, options = {}) {
    this.dataAdapters.push([adapter, options]);
  }

  registerAngularDependency(dependency) {
    if (_.isArray(dependency)) {
      for (const d of dependency) {
        this.registerAngularDependency(d);
      }

      return;
    }

    if (_.isString(dependency)) {
      ngDependencies.push(dependency);
      logger.log(`Angular Dependency "${dependency}" has been registered.`);
      return;
    }

    logger.warn(`Angular Dependencies must be Strings or an Array of Strings.`);
  }

  use(plugin, options = {}) {
    if (!_.isFunction(plugin)) {
      throw new Error("The 'plugin' parameter must be a function.");
    }

    plugin = plugin(options);

    if (!_.isFunction(plugin)) {
      throw new Error("The 'plugin' parameter must return a function.");
    }

    this.plugins.push(plugin);
  }

  registerWidgets(widgets) {
    if (!_.isArray(widgets)) {
      throw new Error(
        `The parameter should be an array of widget factories or widget objects. See ${docs}/guides/widgets.html`
      );
    }

    _.each(widgets, widget => {
      this.registerWidget(widget);
    });
  }

  registerWidget(widget, param2) {
    let name = null;
    let hasSettings = true;

    // Für open.DASH Version < 2.0.0-rc.9
    if (_.isString(widget) && param2) {
      throw new Error(`You are using a deprecated API, see ${docs}`);
    }

    if (_.isFunction(widget)) {
      widget = widget({});
    }

    if (!widget || !_.isObject(widget)) {
      logger.error(
        `You need to register a widget factory or a widget object. See ${docs}/guides/widgets.html`
      );
      return;
    }

    if (_.isString(widget.name)) {
      name = widget.name;
    }

    // if(!/^([A-Z][a-z]+)+/.test(widget_name)) {
    if (!/^([a-z]+([-][a-z]+)*)$/.test(name)) {
      logger.error(
        `Error in widget "${name}": Widget has a forbidden name. The name must match the following REGEX: /^([a-z]+([}]\\-][a-z]+)*)$/`
      );
      return;
    }

    if (!widget.widgetController) {
      logger.error(
        `Error in widget "${name}": Widget objects need the property 'widgetController'. See ${docs}/guides/widgets.html`
      );
      return;
    }

    if (!widget.settingsController) {
      logger.warn(
        `Error in widget "${name}": Widget objects need the property 'settingsController'. See ${docs}/guides/widgets.html`
      );

      hasSettings = false;
    }

    if (!widget.widgetTemplate) {
      logger.error(
        `Error in widget "${name}": Widget objects need the property 'widgetTemplate'. See ${docs}/guides/widgets.html`
      );
      return;
    }

    if (!widget.settingsTemplate) {
      logger.warn(
        `Error in widget "${name}": Widget objects need the property 'settingsTemplate'. See ${docs}/guides/widgets.html`
      );

      hasSettings = false;
    }

    if (widget.presets && _.isArray(widget.presets)) {
      _.map(widget.presets, preset => {
        if (_.isObject(preset)) {
          preset.config = preset.config || config;

          preset.name = preset.name || `Preset Name Missing, type: ${name}`;
          preset.config.type = name;
          preset.config.name = preset.config.name || preset.name;

          this.widgetPresets.push(preset);
        }
      });
    }

    components.push([
      `od-widget-${name}`,
      {
        template: widget.widgetTemplate,
        controller: widget.widgetController,
        bindings: {
          widget: "<",
          config: "<",
          state: "<",
          loading: "="
        }
      }
    ]);

    if (hasSettings) {
      components.push([
        `od-widget-${name}-settings`,
        {
          template: widget.settingsTemplate,
          controller: widget.settingsController,
          bindings: {
            widget: "<",
            config: "<",
            closeSettingsModal: "<"
          }
        }
      ]);
    }

    logger.log(
      `Widget "${name}" has been registered with ${
        widget.presets.length
      } preset(s).`
    );
  }

  config(settings) {
    settings.forEach((value, key) => {
      this.env(key, value);
    });
  }

  registerTranslation(translation) {
    logger.assert(_.isArray(translation), "A translation must be an Array");
    logger.assert(
      translation.length === 2,
      "The length of an translation Array must be 2"
    );

    this.translations.push(translation);
  }

  i18n(settings) {
    if (settings.translations && _.isObject(settings.translations)) {
      _.each(settings.translations, (value, key) => {
        this.translations.push([key, value]);
      });
    }
  }

  start() {
    instanceStarted = true;

    ngModule = angular.module("opendash", ngDependencies);

    this.module.config(config);

    this.module.value("moment", moment);
    this.module.value("lodash", _);

    logger.assert(this.userAdapter, "You need an user adapter.");

    $user.init(this.userAdapter);

    this.module.value("od.adapter.register", this.dataAdapters);
    this.module.value("od.widget.presets", this.widgetPresets);

    this.plugins.forEach(plugin => {
      plugin(this, this.module, this.name);
    });

    services.forEach(s => {
      if (s[2]) {
        this.module.value(`opendash/services/${s[0]}`, s[1]);
      } else {
        this.module.service(`opendash/services/${s[0]}`, s[1]);
      }
    });

    components.forEach(c => {
      if (c[2]) {
        this.module.directive(_.camelCase(c[0]), c[1]);
      } else {
        this.module.component(_.camelCase(c[0]), c[1]);
      }
    });

    this.module.config([
      "$translateProvider",
      $translateProvider => {
        this.translations.forEach(([key, translation]) => {
          $translateProvider.translations(key, translation);
        });

        const keys = this.translations
          .map(([key, translation]) => key)
          .filter((v, i, a) => a.indexOf(v) === i);

        const overwriteLanguage = window.localStorage.getItem(
          "opendash/language"
        );
        


        $translateProvider.fallbackLanguage("en");
        $translateProvider.registerAvailableLanguageKeys(keys);

        if (keys.includes(overwriteLanguage)) {
          $translateProvider.preferredLanguage(overwriteLanguage);
          this.setHighchartsLang(overwriteLanguage);
        } else {
          $translateProvider.determinePreferredLanguage();
          this.setHighchartsLang("en");
        }

        
        



        $translateProvider.useSanitizeValueStrategy("escape");
        // logger.log(`i18n: ${language} => ${JSON.stringify($translateProvider.translations(), null, 2)}`);
      }
    ]);

    this.module.run([
      "$q",
      q => {
        ngHelper.init(async () => {
          await q.resolve();
        });
      }
    ]);

    this.router.calcCurrent();

    logger.log("Instance started.");

    return this.module.name;
  }

  setHighchartsLang(lang) {
    console.log("Set Language: " +this.lang);
    if(lang == "de") {
      moment.locale("de");
      Highcharts.setOptions({lang: {
        thousandsSep: ".",
        decimalPoint: ",",
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ],
        weekdays: [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag",
        ],
        shortMonths: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mai",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Dez",
        ],
        notData: "Keine Daten verfügbar",
        resetZoom: "Zoom zurücksetzen",
      }});
    } else {
      moment.locale("en-gb");
      Highcharts.setOptions({lang: {
        thousandsSep: ".",
        decimalPoint: ",",
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        weekdays: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Satarday",
        ],
        shortMonths: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        notData: "No Data available",
        resetZoom: "Reset Zoom",
      }});
    }
  }

}

const instance = new openDASH();

export default instance;
