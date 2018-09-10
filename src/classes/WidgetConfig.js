export default class OpenDashWidgetConfig {
    constructor(data) {
        this.listener = new Map();
        this.data = (_.isObject(data)) ? data : {};
    }

    watch(key, callback) {
        if (_.isArray(key)) {
            return key.forEach(k => this.watch(k, callback));
        }

        if (!this.listener.has(key)) {
            this.listener.set(key, [callback]);
        } else {
            this.listener.get(key).push(callback);
        }

        callback(this.data[key]);
    }

    notify(key, value, oldValue) {
        if (this.listener.has(key)) {
            this.listener.get(key).forEach(callback => callback(value, oldValue));
        }
    }

    toJSON() {
        return this.data;
    }
}


/*  Use:

    const config = new OpenDashWidgetConfig(widget.config);

    this.config = new Proxy(config, {
        get(target, key) {
        if (['listener', 'watch', 'notify', 'toJSON'].indexOf(key) >= 0) {
            return function OpenDashWidgetConfigProxyFunction(...args) {
            // if (log) logger.log('OpenDashWidgetConfigProxyFunction called.', key, args);
            return target[key].apply(target, args);
            };
        }

        return target.data[key];
        },
        set(target, key, value) {
        if (['listener', 'watch', 'notify', 'toJSON'].indexOf(key) >= 0) {
            throw new Error(`[opendash/services/dashboard] You may not overwrite the widget.config.${key} property.`);
        }

        if (log) logger.log('Widget Config was written.', key, '=', value);

        target.notify(key, value, target.data[key]);
        target.data[key] = value;

        return true;
        },
    });
 */
