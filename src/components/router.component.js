class controller {

    static get $inject() {
        return ['$element', '$compile', '$rootScope', 'opendash/services/router', '$q'];
    }

    constructor($element, $compile, $rootScope, $router, $q) {
        $router.onChange((current) => {
            let scope = $rootScope.$new();
            let component = current.component;

            scope.current = current;

            let template = `<${component} route="current"></${component}>`;

            let element = $compile(template)(scope);

            $element.html(element);

            $q.resolve()
        });
    }
}

const template = '404 - Routing Failed';

let component = {
    controller,
    template,
};

export default component;
