import template from './header.component.html';

class controller {

    static get $inject() {
        return ['opendash/services/header', 'opendash/services/user', 'opendash/services/dashboard', 'opendash/services/presets', 'opendash/services/modal']; 
    }

    constructor($header, $user, $dashboard, $presets, $modal) {

        this.$header = $header;
        this.$user = $user;
        this.$dashboard = $dashboard;
        this.$presets = $presets;
        this.$modal = $modal;

        this.sidebar = false;

        $header.onOverlayClose(() => {
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
