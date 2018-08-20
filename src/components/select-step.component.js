import _ from 'lodash';

import template from './select-step.component.html';

let $data;

class controller {

    static get $inject() {
        return [];
    }

    constructor() {
        this.currentStep = 0;
        this.steps = [];
    }

    $onInit() {
        if (!_.isArray(this.config)) {
            throw new Error('Bad usage of od-select-step config attribute. Must be an Array.');
        }

        if (!_.isFunction(this.watch)) {
            throw new Error('Bad usage of od-select-step watch attribute. Must be a Function.');
        }

        this.steps.push(...this.config);

        this.ready = true;
    }

    get current() {
        return this.currentStep;
    }

    set current(value) {
        this.currentStep = value;
    }

    get last() {
        return this.steps.length - 1;
    }

    getCurrent() {
        return this.steps[this.currentStep];
    }

    navigate(step) {
        if (step === 'next') {
            return this.navigate(this.currentStep + 1);
        } else if (step === 'prev') {
            return this.navigate(this.currentStep - 1);
        }

        if (step < 0) {
            return this.navigate(0);
        }

        if (step > this.last) {
            return this.navigate(this.last);
        }

        this.currentStep = step;

        this.watch(step);
    }

    getNavClass(i) {
        const base = 'od__select-steps__icons__item';

        if (i < this.currentStep) {
            return `${base}--done`;
        }

        if (i === this.currentStep) {
            return `${base}--active`;
        }

        return '';
    }
}

let component = {
    controller,
    template,
    bindings: {
        config: '<',
        watch: '<',
    },
};

export default component;
