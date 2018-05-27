import template from './header.component.html';

class controller {

    static get $inject() {
        return ['$injector']; 
    }

    constructor($injector) {

        this.$header = $injector.get('opendash/services/header');
        this.$user = $injector.get('opendash/services/user');
        this.$dashboard = $injector.get('opendash/services/dashboard');
        this.$presets = $injector.get('opendash/services/presets');
        this.$modal = $injector.get('opendash/services/modal');
        this.$env = $injector.get('opendash/services/env');

        this.sidebarMode = this.$env('OD-HEADER-SIDEBAR-MODE', null, true);

        this.overlay = this.$header.createOverlay(true, false);

        this.overlay.active = false;
        this.overlay.index = 5001;
    }

    get sidebar() {
        return this.overlay.active;
    }

    createDashboard() {
        this.$modal.prompt('od.header.dashboards.create_prompt').then(response => {
            if (response) {
                this.$dashboard.changeDashboard(response);
            }
        });
    }

    deleteDashboard() {
        this.$modal.confirm('od.header.dashboards.delete_prompt').then(response => {
            if (response) {
                this.$dashboard.deleteCurrentDashboard();
            }
        });
    }

    toggleSidebar() {
        this.overlay.toggle();
    }
}

let component = {
    controller,
    template,
};

export default component;
