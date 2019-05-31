export default class OpenDashWidgetOperations {
  constructor(widget) {
    this.widget = widget;
  }

  rename(name) {
    this.widget.dynamicName = name;
  }

  onRequest(name, callback) {
    this.widget.requestListener[name] = callback;
  }
}
