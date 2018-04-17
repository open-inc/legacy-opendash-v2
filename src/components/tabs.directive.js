import template from './tabs.directive.html';

export default function OpendashTabs() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        template: template,
        bindToController: true,
        controllerAs: '$tabs',
        controller: OpendashTabsController,
    };
}

class OpendashTabsController {
    constructor() {
        this.tabs = [];
    }

    addTab(tab) {
        this.tabs.push(tab);

        if (this.tabs.length === 1) {
            tab.active = true;
        }
    }

    select(selectedTab) {
        this.tabs.forEach((tab) => {
            if (tab.active && tab !== selectedTab) {
                tab.active = false;
            }
        });

        selectedTab.active = true;
    }
}
