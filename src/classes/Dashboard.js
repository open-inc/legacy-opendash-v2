import _ from "lodash";
import OpenDashWidget from "./Widget";

export default class OpenDashDashboard {
  constructor({
    id,
    name = "Home",
    location = null,
    version = 2,
    widgets = []
  }) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.version = version;

    this.widgets = [];

    if (_.isArray(widgets)) {
      widgets.forEach(widget => this.addWidget(widget));
    }

    this.ready = true;
  }

  addWidget(widget) {
    if (!(widget instanceof OpenDashWidget)) {
      widget = new OpenDashWidget(widget);
    }

    this.widgets.push(widget);
  }

  removeWidget(widget) {
    if (widget instanceof OpenDashWidget) {
      _.pull(this.widgets, widget);
    }
  }

  removeAllWidgets() {
    _.remove(this.widgets, widget => true);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      version: this.version,
      widgets: this.widgets
    };
  }
}
