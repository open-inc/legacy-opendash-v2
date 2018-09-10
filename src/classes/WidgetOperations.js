export default class OpenDashWidgetOperations {
    constructor(widget) {
        this.widget = widget;
    }

    rename(name) {
        this.widget.name = name;
    }

    onRequest(name, callback) {
        this.widget.requestListener[name] = callback;
    }
}
