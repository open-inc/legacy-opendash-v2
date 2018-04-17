import template from './auth.component.html';

class controller {

    static get $inject() {
        return ['opendash/services/user', 'opendash/services/notification'];
    }

    constructor($user, $notification) {

        this.$user = $user;
        this.$notification = $notification;

        this.state = 'login';
        this.form = {};
    }

    login() {
        this.$user.login(this.form).then(null, (error) => {
            this.$notification.danger('Combination of Login and Password is incorrect.');
        });
    }

    register() {
        this.$notification.danger('Signup failed.');
    }
}

let component = {
    controller,
    template,
};

export default component;
