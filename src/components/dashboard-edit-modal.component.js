const template = `

<p>
  {{ 'od.dashboard.shared.invite' | translate }}
</p>

<select 
  ng-if="$ctrl.users"
  ng-options="user.key as user.label for user in $ctrl.users"
  ng-model="$ctrl.user"
></select>

<p ng-show="$ctrl.user">
  {{ 'od.dashboard.shared.invite_info' | translate }}
</p>
`;

class controller {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    this.init($injector);
  }

  async init($injector) {
    try {
      const $user = $injector.get("opendash/services/user");
      const $dashboard = $injector.get("opendash/services/dashboard");
      const $notification = $injector.get("opendash/services/notification");
      const $q = $injector.get("$q");

      await $user.wait();

      // let userIds = [...$dashboard.current.shared];

      let users = await $user.listUsers();

      users = users.map(user => ({
        key: user.id,
        label: `${user.name || user.username} (${user.email || user.id})`
      }));

      this.users = users;

      this.invite = async () => {
        try {
          if (!this.user) {
            throw null;
          }

          await $user.shareDashboardWithUser($dashboard.current.id, this.user);

          $dashboard.current.shared = true;

          $notification.success("od.dashboard.shared.invite_success");
        } catch (error) {
          $notification.danger("od.dashboard.shared.invite_error");
        }
      };

      $q.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  $onInit() {
    try {
      this.modal.header = false;

      this.modal.addFooterAction({
        label: "od.ui.cancel",
        icon: "fa-ban",
        cls: "button--outline",
        floatRight: true,
        isVisible: () => true,
        action: ({ close }) => {
          close();
        }
      });

      this.modal.addFooterAction({
        label: "od.ui.ok",
        // icon: "fa-ban",
        // cls: "",
        floatRight: true,
        isVisible: () => true,
        isDisabled: () => !this.user,
        action: ({ close }) => {
          this.invite().then(() => {
            close();
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

let component = {
  controller,
  template,
  bindings: {
    modal: "<"
  }
};

export default component;
