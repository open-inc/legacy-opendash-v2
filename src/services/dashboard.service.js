import _ from 'lodash';

import Observable from '../helper/observable.class';
import Logger from '../helper/logger';

const logger = Logger('opendash/services/dashboard');

let reload = true;

let $user;
let $event;
let $env;

let $timeout;
let $scope;

export default class Dashboard {

    static get $inject() {
        return ['$injector'];
    }

    constructor($injector) {
        $user = $injector.get('opendash/services/user');
        $event = $injector.get('opendash/services/event');
        $env = $injector.get('opendash/services/env');
        $timeout = $injector.get('$timeout');
        $scope = $injector.get('$rootScope');

        reload = $env('OD-DASHBOARD-RELOAD', null, true);

        // debounce der save methode, weil die save Methode teilweise sehr oft
        // pro Sekunde aufgerufen wird, vor allem bei Drag and Drop Operationen
        // this.save = debounce(this.save, 500);

        this.data = new OpenDashDashboardStore();

        this.init();
        this.initGridsterConfig();
        this.initWidgetResizeEvent();
    }

    get current() {
        return this.data.current;
    }

    get dashboards() {
        return _.keys(this.data.dashboards) || [];
    }

    get ls() {
        return window.localStorage.getItem('od.dashboard.service-current-dashboard') || null;
    }

    set ls(value) {
        window.localStorage.setItem('od.dashboard.service-current-dashboard', value);
    }

    init() {
        $user.wait()
            .then(() => $user.getData('dashboard'))
            .then(data => {
                if (data == null || !data || !_.isObject(data.dashboards) || !_.isString(data.default) || !data.dashboards[data.default]) {
                    this.data.clear();
                    this.save();
                } else {
                    this.data.load(data);
                }
                return true;
            }, err => {
                this.data.clear();
                this.save();
                return true;
            })
            .then(() => {
                const queryDashboardOverwrite = $env('OD-DASHBOARD-QUERYSTRING-OVERWRITE', null, false);

                if (queryDashboardOverwrite) {
                    this.ls = getParameterByName(queryDashboardOverwrite);
                }

                let currentDashboard = this.ls || this.data.default;

                logger.log(`Dashboard selected: ${currentDashboard}`);

                this.data.current = currentDashboard;

                this.ready = true;

                $event.emit('od-dashboard-ready');

                this.observable = new Observable(this.data);

                this.observable.onChange(() => {
                    $event.emit('od-dashboard-changed');
                    $event.emit('od-widgets-changed');
                });

                $event.on(['od-dashboard-changed', 'od-widgets-created', 'od-widgets-removed', 'od-dashboard-editmode-disabled'], () => {
                    this.save();
                });
            });
    }

    changeDashboard(name) {
        if (name === this.ls) return;
        this.ls = name;
        if (reload) location.reload();
    }

    deleteCurrentDashboard() {
        if (this.data.removeDashboard()) {
            this.ls = this.data.default;
            this.save().then(() => {
                if (reload) location.reload();
            });
        }
    }

    initGridsterConfig() {

        // https://github.com/ManifestWebDesign/angular-gridster#configuration

        this.gridsterConfig = {
            columns: 12,
            margins: [20, 20],
            outerMargin: false,
            pushing: true,
            floating: true,
            mobileBreakPoint: 600,
            minSizeX: 2,
            maxSizeX: null,
            minSizeY: 2,
            maxSizeY: null,
            draggable: {
                enabled: false,
                handle: 'od-widget-header',
            },
            resizable: {
                enabled: false,
                handles: ['n', 'e', 's', 'w', 'se', 'sw'],
                stop: function (event, $element, widget) {
                    $event.emit('od-widgets-resize');
                    $timeout(() => {
                        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                            let evt = document.createEvent('UIEvents');
                            evt.initUIEvent('resize', true, false, window, 0);
                            window.dispatchEvent(evt);
                        } else {
                            window.dispatchEvent(new Event('resize'));
                        }
                    }, 200);
                },
            },
        };

        this.gridsterItemConfig = {
            sizeX: 'widget.grid[0]',
            sizeY: 'widget.grid[1]',
            row: 'widget.grid[2]',
            col: 'widget.grid[3]',
        };
    }

    initWidgetResizeEvent() {

        // $(window).resize(event => {
        //   $event.emit('od-widgets-resize');
        // });

        $event.on(['od-widgets-resize', 'od-widgets-changed'], () => {
            //logger.log("RESIZE");
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                let evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            } else {
                window.dispatchEvent(new Event('resize'));

            }

        });

        $scope.$on('gridster-resized', (sizes, gridster) => {
            $event.emit('od-widgets-resize');
        });

        $scope.$on('gridster-item-resized', item => {
            $event.emit('od-widgets-resize');
        });
    }

    addWidget(widget) {
        this.current.addWidget(widget);
        $event.emit('od-widgets-created');
        return true;
    }

    removeWidget(widget) {
        this.current.removeWidget(widget);
        $event.emit('od-widgets-removed');
        return true;
    }

    toggleEditMode() {
        const isEditMode = this.getEditMode();

        if (isEditMode) {
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                let evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            } else {
                window.dispatchEvent(new Event('resize'));

            }
        }

        this.gridsterConfig.draggable.enabled = !isEditMode;
        this.gridsterConfig.resizable.enabled = !isEditMode;

        $event.emit('od-dashboard-editmode-toggle');

        if (this.gridsterConfig.draggable.enabled) {
            $event.emit('od-dashboard-editmode-enabled');
        } else {
            $event.emit('od-dashboard-editmode-disabled');
        }
    }

    getEditMode() {
        return this.gridsterConfig.draggable.enabled && this.gridsterConfig.resizable.enabled;
    }

    save() {
        return $user.setData('dashboard', this.data).then((data) => {
            $event.emit('od-dashboard-save');
            return true;
        });
    }

    _cleanDataKeys(data) {

        let i = 1;

        _.forEach(data.dashboards, dashboard => {

            _.forEach(dashboard.widgets, widget => {

                widget['$$hashKey'] = i;
                i++;

            });

        });

        return data;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class OpenDashDashboardStore {

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

class OpenDashDashboard {
    constructor(dashboard) {
        this.widgets = [];

        if (dashboard && _.isArray(dashboard.widgets)) {
            dashboard.widgets.forEach(widget => this.addWidget(widget));
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
            widgets: this.widgets,
        };
    }
}

class OpenDashWidget {
    constructor(widget) {
        if (!widget) {
            throw new Error('[opendash/services/dashboard] You can not create an empty Widget.');
        }

        if (!widget.name) {
            throw new Error('[opendash/services/dashboard] You can not create a Widget without a name.');
        }

        if (!widget.type) {
            throw new Error('[opendash/services/dashboard] You can not create a Widget without a type.');
        }

        this.name = widget.name;
        this.type = widget.type;
        this.grid = widget.grid;

        this.operations = {
            rename: (name) => {
                this.name = name;
            },
        };

        const state = {
            enabled: true,
            loading: true,
            config: true,
            data: true,
            alert: false,
        };

        this.state = {
            get loading() {
                return state.loading;
            },
            set loading(value) {
                state.loading = value;
            },
            get config() {
                return state.config;
            },
            set config(value) {
                state.config = value;
                state.enabled = value;
                state.loading = value;

                if (value === true) {
                    state.data = value;
                }
            },
            get data() {
                return state.data;
            },
            set data(value) {
                state.data = value;
                state.config = value;
                state.enabled = value;
                state.loading = value;
            },
            get alert() {
                return state.alert;
            },
            set alert(value) {
                state.alert = value;
            },
            get enabled() {
                return state.enabled;
            },
            set enabled(value) {
                state.enabled = value;
            },
        };

        this.config = widget.config;

        // const config = new OpenDashWidgetConfig(widget.config);

        // this.config = new Proxy(config, {
        //   get(target, key) {
        //     if (['listener', 'watch', 'notify', 'toJSON'].indexOf(key) >= 0) {
        //       return function OpenDashWidgetConfigProxyFunction(...args) {
        //         // if (log) logger.log('OpenDashWidgetConfigProxyFunction called.', key, args);
        //         return target[key].apply(target, args);
        //       };
        //     }

        //     return target.data[key];
        //   },
        //   set(target, key, value) {
        //     if (['listener', 'watch', 'notify', 'toJSON'].indexOf(key) >= 0) {
        //       throw new Error(`[opendash/services/dashboard] You may not overwrite the widget.config.${key} property.`);
        //     }

        //     if (log) logger.log('Widget Config was written.', key, '=', value);

        //     target.notify(key, value, target.data[key]);
        //     target.data[key] = value;

        //     return true;
        //   },
        // });
    }

    toJSON() {
        return {
            name: this.name,
            type: this.type,
            grid: this.grid,
            config: this.config,
        };
    }
}

// class OpenDashWidgetConfig {
//     constructor(data) {
//         this.listener = new Map();
//         this.data = (_.isObject(data)) ? data : {};
//     }

//     watch(key, callback) {
//         if (_.isArray(key)) {
//             return key.forEach(k => this.watch(k, callback));
//         }

//         if (!this.listener.has(key)) {
//             this.listener.set(key, [callback]);
//         } else {
//             this.listener.get(key).push(callback);
//         }

//         callback(this.data[key]);
//     }

//     notify(key, value, oldValue) {
//         if (this.listener.has(key)) {
//             this.listener.get(key).forEach(callback => callback(value, oldValue));
//         }
//     }

//     toJSON() {
//         return this.data;
//     }
// }
