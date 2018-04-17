import _ from 'lodash';

import Logger from '../helper/logger';

const logger = Logger('opendash/services/event');

let $rootScope;

export default class EventService {

    static get $inject() {
        return ['$rootScope', 'opendash/services/env'];
    }

    constructor(_$rootScope, $env) {
        $rootScope = _$rootScope;

        this.logging = $env('OD-EVENTS-LOG', null, false);
    }

    on(event, callback) {

        if (event === 'now') {
            callback();
            return () => {};
        }

        if (_.isArray(event)) {
            return event.forEach(e => this.on(e, callback));
        }

        if (_.isString(event)) {
            let cancelEvent = $rootScope.$on(event, () => {
                this.log('Listen', event);
                callback();
            });

            return () => {
                cancelEvent();
            };
        }
    }

    once(event, callback) {
        if (_.isArray(event)) {
            return event.forEach(e => this.once(e, callback));
        }

        if (_.isString(event)) {
            let cancelEvent = $rootScope.$on(event, () => {
                this.log('Listen Once', event);
                callback();
                cancelEvent();
            });
        }
    }

    emit(event) {
        if (_.isArray(event)) {
            return event.forEach(e => this.emit(e));
        }

        if (_.isString(event)) {
            this.log('Emit', event);
            $rootScope.$broadcast(event);
        }
    }

    log(operation, event) {
        if (this.logging) {
            logger.log(`${operation}: ${event}`);
        }
    }
}
