import template from './presets.component.html';

class controller {

    static get $inject() {
        return ['od.widget.presets'];
    }

    constructor(presets) {
        this.presets = presets;
    }
}

let component = {
    controller,
    template,
    bindings: {
        add: '<',
    },
};

export default component;
