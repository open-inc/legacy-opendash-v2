import _ from 'lodash';

let $q;
let $modal;
let $dashboard;
let $header;

export default class Presets {

    static get $inject() {
        return ['$injector'];
    }

    constructor($injector) {
        $q = $injector.get('$q');

        $modal = $injector.get('opendash/services/modal');
        $dashboard = $injector.get('opendash/services/dashboard');
        $header = $injector.get('opendash/services/header');

        $header.addSidebarItem({
            group: 'od.header.widgets.header',
            text: 'od.header.widgets.presets',
            action: () => {
                this.open();
            },
        });
    }

    open() {
        let deferred = $q.defer();

        const options = {
            controller: ['$scope', 'close', function ($scope, close) {
                $scope.add = function (config) {
                    config = _.cloneDeep(config);
                    delete config['$$hashKey'];
                    close(config, 0);
                };
                $scope.loaded = true;
            }],
            template: '<od-presets add="add"></od-presets>',
        };

        $modal.showModal(options).then(modal => {
            modal.close.then((result) => {
                if (result != null && $dashboard.addWidget(result)) {
                    deferred.resolve(true);
                } else {
                    deferred.reject(true);
                }
            });
        });

        return deferred.promise;
    }
}
