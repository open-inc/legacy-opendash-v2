import _ from 'lodash';

const envStore = {};

export default function (key, value, fallback) {

    if (!_.isString(key)) {
        throw new Error('Fehler bei $env(key: String) (opendash/services/env): Parameter "key" muss vom Typ String sein.');
    }

    if (!_.isUndefined(value) && !_.isNull(value)) {
        envStore[key] = value;

        return value;
    }

    let response = _.get(envStore, key);

    if (_.isUndefined(response)) {
        if (_.isUndefined(fallback)) {
            throw new Error(`Fehler bei $env(key: String) (opendash/services/env): Schlüssel "${key}" wurde angefordert, ist aber nicht vorhanden.`);
        }
        response = fallback;
    }

    return response;
}
