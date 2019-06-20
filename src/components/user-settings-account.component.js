import template from "./user-settings-account.component.html";

let $user;
let $notification;
let $q;

class controller {
  static get $inject() {
    return ["$injector", "opendash/services/user", "$q"];
  }

  constructor($injector) {
    $user = $injector.get("opendash/services/user");
    $notification = $injector.get("opendash/services/notification");
    $q = $injector.get("$q");

    this.password = undefined;
    this.password_repeat = undefined;
    this.password_valid = false;
    this.password_changed = false;
  }

  get ready() {
    return $data.ready;
  }

  async $onInit() {
    try {
      await $q.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  passwordChange() {
    this.password_changed = true;
    this.password_valid =
      this.password && this.password === this.password_repeat;
  }

  async passwordSave() {
    try {
      await $user.setPassword(this.password);

      $notification.success("od.user.settings.account.password.success");
    } catch (error) {
      $notification.danger("od.user.settings.account.password.error");
    }
  }
}

let component = {
  template,
  controller: controller
};

export default component;
