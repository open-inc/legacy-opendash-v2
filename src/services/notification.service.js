import _ from 'lodash';

let $timeout;
let $header;

export default class Shortcut {

    static get $inject() {
        return ['$injector'];
    }

    constructor($injector) {
        $timeout = $injector.get('$timeout');
        $header = $injector.get('opendash/services/header');

        this.notifications = [];
    }

    create(input) {

        const notification = new OpenDashNotification(input, $header, $timeout);

        this.notifications.push(notification);
    }

    delete(notification) {
        notification.show = false;
    }

    success(message) {
        return this.create({
            message: message,
            class: 'notification--success',
        });
    }

    info(message) {
        return this.create({
            message: message,
            class: 'notification--info',
        });
    }

    warning(message) {
        return this.create({
            message: message,
            class: 'notification--warning',
        });
    }

    danger(message) {
        return this.create({
            message: message,
            class: 'notification--danger',
        });
    }
}

class OpenDashNotification {
    constructor(input, $header, $timeout) {

        this.watcher = [];

        let defaults = {
            show: true,
            focus: false,
            time: 5000,
        };

        if (_.isString(input)) {
            _.defaults(this, { message: input }, defaults);
        }

        if (_.isObject(input)) {
            _.defaults(this, input, defaults);
        }

        if (this.time) {
            $timeout(() => { this.close; }, this.time);
        }

        if (this.focus) {

            let overlay = $header.createOverlay();

            this.style = { 'z-index': overlay.index + 1 };

            overlay.onClose(() => {
                if (this.show) {
                    this.close();
                }
            });

            this.onClose(() => {
                overlay.close();
            });
        }
    }

    close() {
        this.show = false;
        this.watcher.forEach(cb => cb());
    }

    onClose(callback) {
        if (!this.show) {
            callback();
            return;
        }

        this.watcher.push(callback);
    }
}
