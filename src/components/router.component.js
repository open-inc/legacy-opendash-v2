class controller {

    static get $inject() {
        return ['$element', '$compile', '$rootScope', 'opendash/service/router'];
    }

    constructor($element, $compile, $rootScope, $router) {
        $router.onChange((current) => {
            const scope = $rootScope.$new();
            const component = current.component;
    
            const template = `<${component}></${component}>`;
    
            const element = $compile(template)(scope);
    
            $element.html(element);
        });
    }
}

const template = '404';

let component = {
    controller,
    template,
};

export default component;
