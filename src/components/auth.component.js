import template from "./auth.component.html";

class controller {
  static get $inject() {
    return ["opendash/services/user", "opendash/services/notification"];
  }

  constructor($user, $notification) {
    this.$user = $user;
    this.$notification = $notification;

    this.state = "login";
    this.form = {};
  }

  login() {
    this.$user.login(this.form).then(null, error => {
      this.$notification.danger("od.auth.login_fail");
    });
  }

  register() {
    this.$user
      .register({ email: this.form.email, password: this.form.password })
      .then(
        success => {
          this.$notification.success("od.auth.signup_success");
        },
        error => {
          this.$notification.danger("od.auth.signup_fail");
        }
      );
  }
}

let component = {
  controller,
  template
};

export default component;
