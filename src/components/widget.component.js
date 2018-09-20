import _ from "lodash";

import template from "./widget.component.html";

class controller {
  static get $inject() {
    return [
      "$element",
      "opendash/services/modal",
      "opendash/services/dashboard",
      "opendash/services/event"
    ];
  }

  constructor($element, $modal, $dashboard, $event) {
    this.$modal = $modal;
    this.$dashboard = $dashboard;

    this.menu = false;

    $event.on("od-dashboard-editmode-enabled", () => {
      this.menu = true;
      //$element.addClass('od-widget--edit-mode');
    });

    $event.on("od-dashboard-editmode-disabled", () => {
      this.menu = false;
      $element.removeClass("od-widget--edit-mode");
    });
  }

  settings() {
    const widget = this.widget;

    widget.state.enabled = false;

    let template = `<div ng-if="ready" style="display:block;width:100%;height:100%;">
      <od-widget-${
        widget.type
      }-settings widget="widget.operations" config="config" close-settings-modal="close" style="display:block;width:100%;height:100%;">
      </od-widget-${widget.type}-settings>
      <button ng-click="close(config)">{{ 'od.dashboard.widgets.save' | translate }}</button>
      <button ng-click="close(null)">{{ 'od.dashboard.widgets.abort' | translate }}</button>
    </div>`;

    let options = {
      template: template, // `<od-widget-settings-holder ng-if="ready"></od-widget-settings-holder>`,
      controller: [
        "$scope",
        function($scope) {
          $scope.widget = widget;
          $scope.config = _.cloneDeep(widget.config);
          $scope.ready = true;
        }
      ]
    };

    if (widget.type === "eud-widget") {
      options.width = "1200px";
    }

    this.$modal.showModal(options).then(modal => {
      modal.close.then(function(result) {
        if (_.isObject(result)) {
          _.assign(widget.config, result);
        }

        widget.state.config = true;
      });
    });
  }

  remove() {
    this.$modal.confirm("od.dashboard.widgets.remove").then(response => {
      if (response) {
        this.$dashboard.removeWidget(this.widget);
      }
    });
  }

  rename() {
    this.$modal.prompt("od.dashboard.widgets.rename").then(response => {
      if (response) {
        this.widget.name = response;
      }
    });
  }
}

let component = {
  controller,
  template,
  bindings: {
    widget: "<"
  }
};

export default component;
