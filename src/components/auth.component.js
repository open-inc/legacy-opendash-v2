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

  registerFull() {
    this.$user
      .registerFull({ email: this.form.email, password: this.form.password}, this.form.location_city, this.form.location_long, this.form.location_lat)
      .then(
        success => {
          this.$notification.success("od.auth.signup_success");
          setTimeout(() => {
            location.reload();
          }, 5000);
        },
        error => {
          this.$notification.danger("od.auth.signup_fail");
        }
      );
  }

  resetpw() {
    this.$user.resetPassword(this.form.email);
    this.$notification.success("od.auth.reset_pw");
    this.state = "login";
  }
}

let component = {
  controller,
  template
};

export default component;
