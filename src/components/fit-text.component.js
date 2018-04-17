import $ from 'jquery';

const BASE = 1000;
const FACTOR = 0.7;

const $instances = [];
const $groups = new Map();

class FitTextController {

    static get $inject() {
        return ['$element'];
    }

    constructor($element) {
        $instances.push(this);

        this.$element = $($element);
        this.$child = $element.children();

        this.$child.css({
            'display': 'inline-block',
            'white-space': 'nowrap',
            'padding': 0,
            'margin': 0,
        });

        this.refreshPuffer();
        this.adjustFontSize(true, true);
    }

    get groupMembers() {
        if (this.group) {
            return $instances.filter(i => i !== this && i.group === this.group);
        }

        return [];
    }

    get groupSize() {
        if (this.group && $groups.has(this.group)) {
            return $groups.get(this.group);
        }

        return 1000;
    }

    set groupSize(value) {
        if (this.group) {
            $groups.set(this.group, value);
            this.notifyGroup();
        }
    }

    notifyGroup() {
        this.groupMembers.forEach(i => setTimeout(() => i.adjustFontSize()));
    }

    get hasGroup() {
        return (this.group) ? true : false;
    }

    refreshPuffer() {
        this.puffer = {
            text: this.text,
            width: window.innerWidth,
            height: window.innerHeight,
            widgetwidth: this.$element.innerWidth(),
            widgetheight: this.$element.innerHeight(),
        };
    }

    $doCheck() {
        if (this.text !== this.puffer.text) {
            this.refreshPuffer();
            this.adjustFontSize(true, true);
            return;
        }

        if (window.innerWidth !== this.puffer.width) {
            this.refreshPuffer();
            this.adjustFontSize(true);
            return;
        }

        if (window.innerHeight !== this.puffer.height) {
            this.refreshPuffer();
            this.adjustFontSize(true);
            return;
        }

        if (this.$element.innerWidth() !== this.puffer.widgetwidth) {
            this.refreshPuffer();
            this.adjustFontSize(true);
            return;
        }

        if (this.$element.innerHeight() !== this.puffer.widgetheight) {
            this.refreshPuffer();
            this.adjustFontSize(true);
            return;
        }

        return false;
    }

    adjustFontSize(resetGroup, resetText) {
        if (this.group && resetGroup) {
            this.groupSize = BASE;
        }

        let e = this.$element;
        let c = this.$child;

        c.css({
            'visibility': 'hidden',
            'font-size': `${BASE * FACTOR}px`,
            'line-height': `${BASE}px`,
            'height': 'auto',
            'width': 'auto',
        });

        if (resetText) {
            c.html(this.text);
        }

        let widthFactor = Math.round((e.innerWidth() / c.outerWidth()) * 1000) / 1000;
        let heightFactor = Math.round((e.innerHeight() / c.outerHeight()) * 1000) / 1000;
        let lineHeight = Math.round(Math.floor(Math.min(widthFactor, heightFactor) * BASE));
        let fontSize = Math.round(Math.floor(lineHeight * FACTOR));

        // In case of an bug where outer width/height are 0
        if (!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)) {
            if (!Number.isFinite(lineHeight)) return null;
        }

        if (this.group) {
            if (fontSize > this.groupSize) {
                fontSize = this.groupSize;
            } else {
                this.groupSize = fontSize;
            }
        }

        c.css({
            'font-size': fontSize + 'px',
            'line-height': e.innerHeight() + 'px',
            'height': '100%',
            'width': '100%',
        });

        c.css('visibility', 'visible');
    }
}

let component = {
    template: '<span></span>',
    controller: FitTextController,
    bindings: {
        'text': '<',
        'group': '<',
    },
};

export default component;
