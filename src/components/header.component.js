import template from "./header.component.html";

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
        this.user = this.$user.user;

        this.userActions = [
          {
            label: "od.user.settings.data.action",
            icon: "fa fa-cogs",
            onClick: () => {
              this.$router.go("/user/settings/data");
            }
          },
          {
            label: "od.user.settings.account.action",
            icon: "fa fa-user",
            onClick: () => {
              this.$router.go("/user/settings/account");
            }
          },
          {
            label: "od.user.settings.language.action",
            icon: "fa fa-globe",
            onClick: () => {
              this.$modal.open({
                component: "od-user-settings-lang"
              });
            }
          },
          {
            label: "od.auth.logout",
            icon: "fa fa-sign-out",
            onClick: () => {
              this.$user.logout();
            }
          }
        ];
      } catch (error) {
        console.log(error);
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
    return this.$header.topbar; //.filter(e => !(e.hidden || e.isHidden()));
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

  editDashboard() {
    this.$dashboard.editCurrentDashboard();
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
