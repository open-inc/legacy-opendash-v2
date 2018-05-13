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

        this.sidebar = false;

        this.sidebarMode = this.$env('OD-HEADER-SIDEBAR-MODE', null, true);

        this.$header.onOverlayClose(() => {
            this.sidebar = false;
        });
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
        this.sidebar = !this.sidebar;
        this.$header.setOverlay(this.sidebar);
    }
}

let component = {
    controller,
    template,
};

export default component;
