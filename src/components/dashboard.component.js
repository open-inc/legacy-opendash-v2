import template from "./dashboard.component.html";

class controller {
  static get $inject() {
    return [
      "opendash/services/dashboard",
      "opendash/services/presets",
      "opendash/services/data"
    ];
  }

  constructor($dashboard, $presets, $data) {
    this.$dashboard = $dashboard;
    this.$presets = $presets;
    this.$data = $data;
  }

  get ready() {
    return this.$dashboard.ready && this.$data.ready;
  }

  get empty() {
    return this.ready && this.$dashboard.current.widgets.length === 0;
  }

  onEmptyAction() {
    if (this.$dashboard.dashboardOnEmptyActionOverwrite) {
      this.$dashboard.dashboardOnEmptyActionOverwrite();
    } else {
      this.$presets.open();
    }
  }
}

let component = {
  template,
  controller: controller
};

export default component;
