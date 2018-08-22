import Route from './Route';

export default class OpenDashRouter {
    constructor() {
        this.path = '/';
        this.routes = [];
        this.observer = [];
        this.default = null;
        this.current = null;
    }

    async init() {
        return 'test';
    }

    go(path) {
        // console.log(`[opendash/core/router] Route go: ${path}`);
        if (path !== this.path) {
            this.path = path;

            this.calcCurrent();
        }
    }

    calcCurrent() {
        let route = this.getByPath(this.path);

        if (!route) {
            route = this.getByName(this.default);
        }

        if (!route) {
            return;
        }

        let params = route.params(this.path);

        this.current = {
            name: route.name,
            component: route.component,
            params: params,
        }

        // console.log(`[opendash/core/router] Route go: ${this.path}`);
        this.observer.forEach(cb => cb(this.current));
    }

    onChange(callback) {
        this.observer.push(callback);

        if (this.current) {
            callback(this.current);
        }
    }

    addRoute(name, path, component, def) {
        if (this.getByName(name)) {
            throw new Error('Route name already taken.');
        }

        if (def) {
            this.default = name;
        }

        this.routes.push(new Route(name, path, component));

        // console.log(`[opendash/core/router] Route Added: #${this.routes.length} ${name} (default: ${this.default})`);
    }

    getByName(name) {
        return this.routes.find(r => r.name === name);
    }

    getByPath(path) {
        return this.routes.find(r => r.test(path));
    }

}
