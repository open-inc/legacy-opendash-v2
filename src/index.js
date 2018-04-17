import './vendor';
import 'javascript-detect-element-resize';
import angular from 'angular';
import 'angular-gridster';

import angularTranslate from 'angular-translate';

import _ from 'lodash';
import moment from 'moment';

import services from './services';
import components from './components';
import config from './config';

import Logger from './helper/logger';

import envService from './services/env.service';

const logger = Logger('opendash/core');

let language = 'en';

// Try getting browser default language
if (navigator.languages && _.isArray(navigator.languages) && _.isString(navigator.languages[0])) {
    language = navigator.languages[0].split('-')[0];
}

const docs = 'http://docs.opendash.de';

let instanceStarted = false;

let ngModule = null;

class openDASH {

    constructor() {
        this.plugins = [];
        this.translations = [];
        this.userAdapter = null;
        this.dataAdapters = [];
        this.widgetPresets = [];
    }

    get module() {
        if (!ngModule) {
            this.init();
        }

        return ngModule;
    }

    get name() {
        if (!instanceStarted) {
            throw new Error(`You need to call instance.start() before getting the name, see ${docs}`);
        }

        return this.module.name;
    }

    init(options) {
        if (ngModule) {
            throw new Error(`You need to call instance.init() before calling any other method, see ${docs}`);
        }

        options = options || {};

        const dependencies = [angularTranslate, 'gridster'];

        if (options.dependencies && _.isArray(options.dependencies)) {
            options.dependencies.forEach(dependency => {
                if (_.isString(dependency)) {
                    dependencies.push(dependency);
                    logger.log(`Angular Dependency "${dependency}" has been registered.`);
                }
            });
        }

        ngModule = angular.module('opendash', dependencies);
    }

    registerUserAdapter(adapter, options = {}) {
        this.userAdapter = new adapter(options);
    }

    registerDataAdapter(adapter) {
        this.dataAdapters.push(adapter);
    }

    use(plugin) {
        if (!_.isFunction(plugin)) {
            throw new Error('The \'plugin\' parameter must be a function.');
        }

        this.plugins.push(plugin);
    }

    registerWidgets(widgets) {
        if (!_.isArray(widgets)) {
            throw new Error(`The parameter should be an array of widget factories or widget objects. See ${docs}/guides/widgets.html`);
        }

        _.each(widgets, widget => {
            this.registerWidget(widget);
        });
    }

    registerWidget(widget, param2) {
        let name = null;

        // Für open.DASH Version < 2.0.0-rc.9
        if (_.isString(widget) && param2) {
            throw new Error(`You are using a deprecated API, see ${docs}`);
        }

        if (_.isFunction(widget)) {
            widget = widget({});
        }

        if (!widget || !_.isObject(widget)) {
            logger.error(`You need to register a widget factory or a widget object. See ${docs}/guides/widgets.html`);
            return;
        }

        if (_.isString(widget.name)) {
            name = widget.name;
        }

        // if(!/^([A-Z][a-z]+)+/.test(widget_name)) {
        if (!/^([a-z]+([-][a-z]+)*)$/.test(name)) {
            logger.error(`Error in widget "${name}": Widget has a forbidden name. The name must match the following REGEX: /^([a-z]+([}]\\-][a-z]+)*)$/`);
            return;
        }

        if (!widget.widgetController) {
            logger.error(`Error in widget "${name}": Widget objects need the property 'widgetController'. See ${docs}/guides/widgets.html`);
            return;
        }

        if (!widget.settingsController) {
            logger.error(`Error in widget "${name}": Widget objects need the property 'settingsController'. See ${docs}/guides/widgets.html`);
            return;
        }

        if (!widget.widgetTemplate) {
            logger.error(`Error in widget "${name}": Widget objects need the property 'widgetTemplate'. See ${docs}/guides/widgets.html`);
            return;
        }

        if (!widget.settingsTemplate) {
            logger.error(`Error in widget "${name}": Widget objects need the property 'settingsTemplate'. See ${docs}/guides/widgets.html`);
            return;
        }

        if (widget.presets && _.isArray(widget.presets)) {

            _.map(widget.presets, preset => {

                if (_.isObject(preset)) {

                    preset.config = preset.config || config;

                    preset.name = preset.name || `Preset Name Missing, type: ${name}`;
                    preset.config.type = name;
                    preset.config.name = preset.config.name || preset.name;

                    this.widgetPresets.push(preset);
                }
            });
        }

        components.push([`od-widget-${name}`, {
            template: widget.widgetTemplate,
            controller: widget.widgetController,
            bindings: {
                widget: '<',
                config: '<',
                state: '<',
                loading: '=',
            },
        }]);

        components.push([`od-widget-${name}-settings`, {
            template: widget.settingsTemplate,
            controller: widget.settingsController,
            bindings: {
                widget: '<',
                config: '<',
                closeSettingsModal: '<',
            },
        }]);

        logger.log(`Widget "${name}" has been registered with ${widget.presets.length} preset(s).`);
    }

    config(settings) {
        settings.forEach((value, key) => {
            this.env(key, value);
        });
    }

    env(key, value) {
        envService(key, value);
    }

    registerTranslation(translation) {
        if (_.isArray(translation) && translation.length === 2) {
            this.translations.push(translation);
        }
    }

    i18n(settings) {
        if (settings.language && _.isString(settings.language)) {
            language = settings.language;
        }

        if (settings.translations && _.isObject(settings.translations)) {
            _.each(settings.translations, (value, key) => {
                this.translations.push([key, value]);
            });
        }
    }

    start() {
        instanceStarted = true;

        this.module.config(config);

        this.module.value('moment', moment);
        this.module.value('lodash', _);

        this.module.value('od.user.adapter', this.userAdapter);
        this.module.value('od.adapter.register', this.dataAdapters);
        this.module.value('od.widget.presets', this.widgetPresets);

        services.forEach(s => {
            if (s[2]) {
                this.module.value(`opendash/services/${s[0]}`, s[1]);
            } else {
                this.module.service(`opendash/services/${s[0]}`, s[1]);
            }
        });

        components.forEach(c => {
            if (c[2]) {
                this.module.directive(_.camelCase(c[0]), c[1]);
            } else {
                this.module.component(_.camelCase(c[0]), c[1]);
            }
        });

        this.plugins.forEach((plugin) => {
            plugin(this, this.module, this.name);
        });

        this.module.config(['$translateProvider', ($translateProvider) => {
            this.translations.forEach(translation => {
                $translateProvider.translations(translation[0], translation[1]);
            });

            $translateProvider.preferredLanguage(language);
            $translateProvider.useSanitizeValueStrategy('escape');

            // logger.log(`i18n: ${language} => ${JSON.stringify($translateProvider.translations(), null, 2)}`);
        }]);

        logger.log('Instance started.');

        return this.module.name;
    }
}

const instance = new openDASH();

export default instance;

export { name, angular, _, moment };
