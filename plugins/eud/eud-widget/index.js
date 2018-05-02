import widgetController from './widget/widget.controller.js';
import widgetTemplate from './widget/widget.template.html';

import settingsController from './settings/settings.controller.js';
import settingsTemplate from './settings/settings.template.html';

const name = 'eud-widget';
const presets = [];

export default () => {

    return {
        name,
        widgetController,
        widgetTemplate,
        settingsController,
        settingsTemplate,
        presets,
    };
};
