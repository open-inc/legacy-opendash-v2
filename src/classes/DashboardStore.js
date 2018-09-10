import OpenDashDashboard from '../classes/Dashboard';

export default class OpenDashDashboardStore {

    // TODO: Redo this.default + this.current

    constructor() {
        this.clear();
    }

    get current() {
        return this.dashboards[this._current];
    }

    set current(name) {
        if (!this.dashboards[name]) {
            this.addDashboard(name);
        }
        this._current = name;
    }

    load(config) {
        if (config) {
            if (_.isObject(config.dashboards)) {
                _.forEach(config.dashboards, (dashboard, name) => {
                    this.addDashboard(name, dashboard);
                });
            }

            if (config.default && this.dashboards[config.default]) {
                this.default = config.default;
                this._current = this.default;
            }
        }
    }

    clear() {
        this.default = 'Home';
        this._current = this.default;
        this.dashboards = {};
        this.addDashboard('Home');
    }

    addDashboard(name, dashboard) {
        this.dashboards[name] = new OpenDashDashboard(dashboard);
        return true;
    }

    removeDashboard(dashboard) {
        if (this._current === this.default) {
            return false;
        }

        let current = this._current;
        this._current = this.default;
        _.unset(this.dashboards, [current]);

        return true;
    }

    toJSON() {
        return {
            default: this.default,
            dashboards: this.dashboards,
        };
    }
}
