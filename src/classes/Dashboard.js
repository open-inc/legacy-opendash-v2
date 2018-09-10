import OpenDashWidget from './Widget';

export default class OpenDashDashboard {
    constructor({id, name, version, widgets }) {
        this.id = id;
        this.name = name;
        this.version = version;

        this.widgets = [];

        if (_.isArray(widgets)) {
            widgets.forEach(widget => this.addWidget(widget));
        }

        this.ready = true;
    }

    addWidget(widget) {
        widget = new OpenDashWidget(widget);
        this.widgets.push(widget);
    }

    removeWidget(widget) {
        _.pull(this.widgets, widget);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            version: this.version,
            widgets: this.widgets,
        };
    }
}
