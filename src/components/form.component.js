import lodash from "lodash";

import Logger from "../helper/logger";

const logger = Logger("od.ui.form");

class controller {
  static get $inject() {
    return ["$element", "$compile", "$rootScope", "$q"];
  }

  constructor($element, $compile, $rootScope, $q) {
    this.$onInit = () => {
      logger.assert(
        lodash.isArray(this.form),
        "Databinding 'form' must be an Array"
      );
      logger.assert(
        lodash.isObject(this.data),
        "Databinding 'data' must be an Object"
      );

      let scope = $rootScope.$new();
      let template = "<div>";

      scope.output = this.data;
      scope.helper = {};
      scope.label = {};

      for (const element of this.form) {
        if (!this.validateFormElement(element)) {
          logger.warn("Form Element is not valid.");
          continue;
        }

        // add helper object:
        scope.helper[element.key] = {};

        // add label:
        scope.label[element.key] = element.label;

        template += `<span>{{ label['${element.key}'] | translate }}</span>`;

        switch (element.type) {
          case "input":
            template += `<input
                          type="${element.settings.type || "text"}"
                          ng-model="output['${element.key}']"
                          >`;

            break;

          case "select":
            scope.helper[element.key].options = element.settings.options;

            template += `<select
                          ng-model="output['${element.key}']"
                          ng-options="o.value as o.label for o in helper['${
                            element.key
                          }'].options track by o.value"
                          ></select>`;

            break;

          case "select-item":
            scope.helper[element.key].watcher = function(selection) {
              scope.output[element.key] = selection;
            };

            scope.helper[element.key].settings = Object.assign(
              {},
              element.settings,
              {
                initialSelection: scope.output[element.key]
              }
            );

            template += `<od-select-item
                          config="helper['${element.key}'].settings"
                          watch="helper['${element.key}'].watcher"
                          ></od-select-item>`;

            break;

          case "select-date":
            scope.helper[element.key].watcher = function(selection) {
              scope.output[element.key] = selection;
            };

            scope.helper[element.key].settings = element.settings;

            template += `<od-select-date
                          config="helper['${element.key}'].settings"
                          watch="helper['${element.key}'].watcher"
                          ></od-select-date>`;

            break;

          default:
            logger.warn("Unknown type.");
            break;
        }
      }

      // For debugging:
      // template += "<pre>{{ output }}</pre>";
      template += "</div>";

      // create new element and use it as form html
      let element = $compile(template)(scope);
      $element.html(element);
      $q.resolve();
    };
  }

  validateFormElement(element) {
    return (
      lodash.isObject(element) &&
      lodash.isString(element.type) &&
      lodash.isString(element.key) &&
      lodash.isString(element.label) &&
      lodash.isObject(element.settings)
    );
  }
}

const template = "{{ 'od.ui.form.error.creation' | translate }}";

let component = {
  controller,
  template,
  bindings: {
    form: "<",
    data: "<"
  }
};

export default component;
