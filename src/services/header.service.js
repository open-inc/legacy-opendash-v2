import _ from 'lodash';
import defaultLogo from '../assets/opendash.png';

let $event;

export default class HeaderService {

    static get $inject() {
        return ['opendash/services/event'];
    }

    constructor(_$event) {
        $event = _$event;

        this.overlay = false;
        this.overlayClose;
        this.sidebar = {};
        this.sidebarFooter = [];
        this.topbar = [];
        this.logo = {
            url: defaultLogo,
            action: () => {
            },
        };

        this.overlays = [];
        this.overlayIndex = 5000;
    }

    addLogo(url, action) {
        if (url && _.isString(url)) {
            this.logo.url = url;
        }
        if (action && _.isFunction(action)) {
            this.logo.action = action;
        }
    }

    addSidebarItem(input) {

        const defaultAction = () => { };

        input.group = input.group || 'Neue Gruppe';

        if (!this.sidebar[input.group] && input.group !== 'footer') {
            this.sidebar[input.group] = [];
        }

        const item = {
            icon: input.icon || null,
            text: input.text || 'Neuer Eintrag',
            action: input.action || defaultAction,
            overlay: input.overlay || false,
        };

        if (input.group === 'footer') {
            this.sidebarFooter.push(item);
        } else {
            this.sidebar[input.group].push(item);
        }

        return item;
    }

    addTopbarItem(input) {
        const defaultAction = () => {

        };

        const item = {
            icon: input.icon || '',
            action: input.action || defaultAction,
            active: false,
        };

        this.topbar.push(item);

        return item;
    }

    setOverlay(input) {
        if (this.overlay !== input) {
            if (input) {
                this.overlay = true;
                $event.emit('od-header-overlay-open');
            } else {
                this.overlay = false;
                $event.emit('od-header-overlay-close');
            }
        }
    }

    onOverlayOpen(fn) {
        $event.on('od-header-overlay-open', fn);
    }

    onOverlayClose(fn) {
        $event.on('od-header-overlay-close', fn);
    }

    createOverlay() {
        let overlay = new OpenDashOverlay(this.overlayIndex);

        this.overlays.push(overlay);
        this.overlayIndex += 10;

        return overlay;
    }
}

class OpenDashOverlay {
    constructor(index) {
        this.active = true;
        this.index = index;
        this.watcher = [];
    }

    close() {
        this.active = false;
        this.watcher.forEach(cb => cb());
    }

    onClose(callback) {
        if (!this.active) {
            callback();
            return;
        }

        this.watcher.push(callback);
    }
}
