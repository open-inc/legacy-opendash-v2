import template from "./dashboard.component.html";

class controller {
  static get $inject() {
    return [
      "opendash/services/dashboard",
      "opendash/services/user",
      "opendash/services/presets",
      "opendash/services/data",
      "$q"
    ];
  }

  constructor($dashboard, $user, $presets, $data, $q) {
    this.$dashboard = $dashboard;
    this.$user = $user;
    this.$presets = $presets;
    this.$data = $data;
    this.$q = $q;
  }

  get ready() {
    return this.$dashboard.ready && this.$data.ready;
  }

  get empty() {
    return this.ready && this.$dashboard.current.widgets.length === 0;
  }

  isShared() {
    try {
      if (this.shared) {
        return true;
      }

      if (!this.$dashboard.current.shared) {
        return false;
      }

      if (!Array.isArray(this.$dashboard.current.shared)) {
        return true;
      }

      if (!this.shared) {
        this.shared = "Keine Informationen vorhanden.";
      }

      this.$user.listUsers().then(users => {
        let userIds = [...this.$dashboard.current.shared];

        users = users.filter(user => userIds.includes(user.id));

        users = users.map(
          user => user.name || user.username || user.email || user.id
        );

        this.shared = users.join(", ");

        this.$q.resolve();
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  onEmptyAction() {
    if (this.$dashboard.dashboardOnEmptyActionOverwrite) {
      this.$dashboard.dashboardOnEmptyActionOverwrite();
    } else {
      this.$presets.open();
    }
  }
}

let component = {
  template,
  controller: controller
};

export default component;
