import _ from 'lodash';

import template from './select-item.component.html';

let $user;
let $data;
let $q;

class controller {

    static get $inject() {
        return ['$injector'];
    }

    constructor($injector) {
        $user = $injector.get('opendash/services/user');
        $data = $injector.get('opendash/services/data');

        $q = $injector.get('$q');

        this.flags = [
            {
                icon: 'fa-clock-o',
                label: 'Show virtual sensors',
                active: true,
                filter: (active, item, dimension) => {
                    // only show virtual sensors if active
                    return (item.meta.virtualSensor) ? active : true;
                },
            },
            {
                icon: 'fa-calculator',
                label: 'Show alarm sensors',
                active: true,
                filter: (active, item, dimension) => {
                    // only show alarm sensors if active
                    return (item.meta.alarm) ? active : true;
                },
            },
        ];

        this.output = [];
        this.dropdownValue = null;
    }

    async $onInit() {
        try {

            await $user.wait();
            await $data.wait();

            if (!_.isObject(this.config)) {
                throw new Error('Bad usage of od-select-item config attribute. Must be an Object.');
            }

            if (!_.isFunction(this.watch)) {
                throw new Error('Bad usage of od-select-item watch attribute. Must be a Function.');
            }

            const query = $data.query();

            if (this.config.root) {
                query.root();
            }

            if (this.config.containers) {
                query.container();
            }

            if (this.config.items) {
                query.items();
            }

            if (this.config.filter && _.isFunction(this.config.filter)) {
                query.filter(this.config.filter);
            }

            if (this.config.type) {
                this.available = $data.listByType(this.config.type, query.run());
                this.vo = true;
            } else {
                this.available = query.run();
                this.vo = false;
            }

            await $q.resolve();

            this.searchOnChange();
        } catch (error) {
            console.error(error);
        }
    }

    get items() {
        return (this.searchResult) ? this.searchResult : this.available;
    }

    searchOnChange() {
        this.searchResult = this.available;

        if (this.searchText) {

            this.searchResult = this.searchResult.filter(i => {
                let item = (this.vo) ? i[0] : i;

                let nameMatch = item.name.toLowerCase().includes(this.searchText.toLowerCase());

                return nameMatch;
            });
        }

        for (const flag of this.flags) {
            this.searchResult = this.searchResult.filter(i => flag.filter(flag.active, (this.vo) ? i[0] : i, (this.vo) ? i[1] : null));
        }

        return this.searchResult;
    }

    flagToggle(flag) {
        flag.active = !flag.active;

        this.searchOnChange();
    }

    flagClass(flag) {
        return flag.icon + ((flag.active) ? ' od-select-item__search__flags__flag--active' : '');
    }

    dropdownOnChange() {
        this.watch(this.dropdownValue.value);
    }

    get dropdownOptions() {
        if (this.vo) {
            return this.items.map(item => {
                return {
                    id: JSON.stringify([item[0].id, item[1]]),
                    value: [item[0].id, item[1]],
                    name: `${item[0].name} - ${item[0].valueTypes[item[1]].name}`,
                };
            });
        } else {
            return this.items.map(item => {
                return {
                    id: item.id,
                    value: item.id,
                    name: item.name,
                };
            });
        }
    }

    isSelected(e) {
        if (this.vo) {
            return (_.find(this.output, o => o[0] === e[0] && o[1] === e[1])) ? true : false;
        } else {
            return this.output.indexOf(e) >= 0;
        }
    }

    toggleSelected(e) {
        let isSelected = this.isSelected(e);

        if (!this.config.multi) {
            this.output.length = 0;
        }

        if (isSelected) {
            if (this.vo) {
                _.remove(this.output, o => o[0] === e[0] && o[1] === e[1]);
            } else {
                _.pull(this.output, e);
            }
        } else {
            this.output.push(e);
        }

        if (this.config.multi) {
            this.watch(this.output);
        } else {
            this.watch(this.output[0] || undefined);
        }
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
