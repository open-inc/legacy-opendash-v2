import angular from 'angular';
import $ from 'jquery';

let $animate;
let $document;
let $compile;
let $controller;
let $rootScope;
let $q;
let $timeout;
let $header;
let $translate;

export default class Modal {

    static get $inject() {
        return ['$injector'];
    }

    constructor($injector) {
        $animate = $injector.get('$animate');
        $document = $injector.get('$document');
        $compile = $injector.get('$compile');
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $timeout = $injector.get('$timeout');
        $translate = $injector.get('$translate');

        $header = $injector.get('opendash/services/header');
    }

    appendChild(parent, child) {
        let children = parent.children();

        if (children.length > 0) {
            return $animate.enter(child, parent, children[children.length - 1]);
        }

        return $animate.enter(child, parent);
    }

    prompt(message) {
        return $translate(message)
            .then(msg => msg, id => id)
            .then(msg => {
                const response = prompt(msg);
                if (response !== null) {
                    return response;
                } else {
                    return $q.reject(new Error('[opendash/services/modal] No response.'));
                }
            });
    }

    confirm(message) {
        return $translate(message)
            .then(msg => msg, id => id)
            .then(msg => {
                const response = confirm(msg);
                if (response !== null) {
                    return response;
                } else {
                    return $q.reject(new Error('[opendash/services/modal] No response.'));
                }
            });
    }

    async open({ component, width, data }) {

        let template = `<${component} ng-if="ready" modal="modalSettings"></${component}>`;
        let controller = ['$scope', 'close', ($scope, close) => {
            $scope.modalSettings = {
                close,
                data,
            };

            $scope.ready = true;
        }];

        let options = {
            controller,
            template,
            width,
        };

        await this.showModal(options);

        await $q.resolve();
    }

    showModal(options) {
        if (!options.controller) {
            return $q.reject('Modal benötigt options.controller');
        }

        if (!options.template) {
            return $q.reject('Modal benötigt options.template');
        }

        const overlay = $header.createOverlay(true);

        overlay.onClose(() => {
            cleanUpClose(null);
        });

        angular.element(document).one('keydown', (event) => { // TODO
            if (event.keyCode == 27) {
                overlay.close();
            }
        });

        let style = `z-index: ${overlay.index + 1}; `;

        if (options.width) {
            style += `max-width: ${options.width}; `;
        }

        let template = `
            <od-modal class="animated fadeInDown" style="${style}">
                <od-modal-header>
                    <od-modal-close class="fa fa-times" aria-hidden="true" ng-click="close()">
                    </od-modal-close>
                </od-modal-header>
                <od-modal-content>
                    ${options.template}
                </od-modal-content>
            </od-modal>`;

        let closed = false;

        // todo
        let body = angular.element($document[0].body);
        // let body = angular.element('opendash');
        let modalScope = $rootScope.$new();
        let closeDeferred = $q.defer();
        let closedDeferred = $q.defer();

        let inputs = {
            $scope: modalScope,
            close: (result, delay) => {

                if (!angular.isNumber(delay) || delay < 0 || delay > 10000) {
                    delay = 0;
                }

                $timeout(() => {
                    cleanUpClose(result);
                }, delay);
            },
        };

        modalScope.close = inputs.close;

        if (options.inputs) angular.extend(inputs, options.inputs);

        let linkFn = $compile(template);
        let modalElement = linkFn(modalScope);
        inputs.$element = modalElement;

        let controllerObjBefore = modalScope[options.controllerAs];
        let modalController = $controller(options.controller, inputs, false, options.controllerAs);

        if (options.controllerAs && controllerObjBefore) {
            angular.extend(modalController, controllerObjBefore);
        }

        if (options.appendElement) {
            this.appendChild(options.appendElement, modalElement);
        } else {
            this.appendChild(body, modalElement);
        }

        let modal = {
            controller: modalController,
            scope: modalScope,
            element: modalElement,
            close: closeDeferred.promise,
            closed: closedDeferred.promise,
        };

        function cleanUpClose(result) {

            if (closed) return;

            closed = true;
            overlay.close();

            $(modalElement).addClass('fadeOutUp');

            closeDeferred.resolve(result);

            $timeout(function () {
                $animate.leave(modalElement).then(function () {
                    closedDeferred.resolve(result);
                    modalScope.$destroy();
                    inputs.close = null;
                    closeDeferred = null;
                    modal = null;
                    inputs = null;
                    modalElement = null;
                    modalScope = null;
                    angular.element(document).off('keydown'); // TODO
                });

            }, 1000);
        }

        return $q.resolve(modal);
    }
}
