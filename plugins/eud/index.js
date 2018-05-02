import eudWidget from './eud-widget';
import eudService from './eud.service';
import eudComponent from './eud.component';

export default function(options) {
    return function(instance, module, name) {
        instance.registerWidget(eudWidget());
        instance.module.service('opendash/services/eud', eudService);
        instance.module.component('odEudEditor', eudComponent);
        instance.module.run(['opendash/services/eud', ($eud) => {
    
        }]);
    }
}
