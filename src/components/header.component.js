import template from "./header.component.html";

import Hash from "../classes/Hash";

class controller {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    this.$header = $injector.get("opendash/services/header");
    this.$user = $injector.get("opendash/services/user");
    this.$dashboard = $injector.get("opendash/services/dashboard");
    this.$presets = $injector.get("opendash/services/presets");
    this.$modal = $injector.get("opendash/services/modal");
    this.$env = $injector.get("opendash/services/env");
    this.$router = $injector.get("opendash/services/router");

    this.sidebarMode = this.$env("OD-HEADER-SIDEBAR-MODE", null, true);

    this.overlay = this.$header.createOverlay(true, false);

    this.overlay.active = false;
    this.overlay.index = 5001;

    this.user = null;
    this.userActions = [];
    this.userActionsActive = false;

    this.$user.wait().then(() => {
      try {
        this.user = {
          email: this.$user.user.email
          // profile:
          //   "https://s.gravatar.com/avatar/" +
          //   Hash.md5(this.$user.user.email) +
          //   "?s=80&d=retro"
        };

        this.userActions = [
          {
            label: "od.auth.logout",
            icon: "fa fa-sign-out",
            onClick: () => {
              this.$user.logout();
            }
          }
        ];
      } catch (error) {
        this.user = null;
      }
    });
  }

  get showHamburger() {
    try {
      return (
        this.$user.auth && this.$router.current.component === "od-dashboard"
      );
    } catch (error) {
      return false;
    }
  }

  get showEditMode() {
    try {
      return (
        this.$user.auth && this.$router.current.component === "od-dashboard"
      );
    } catch (error) {
      return false;
    }
  }

  get topbarItems() {
    return this.$header.topbar.filter(e => !e.hidden);
  }

  get sidebar() {
    return this.overlay.active;
  }

  createDashboard() {
    this.$modal.prompt("od.header.dashboards.create_prompt").then(response => {
      if (response) {
        this.$dashboard.createDashboard(response);
      }
    });
  }

  deleteDashboard() {
    this.$modal.confirm("od.header.dashboards.delete_prompt").then(response => {
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
  template
};

export default component;
