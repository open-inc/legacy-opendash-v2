import template from "./user-settings-data.component.html";

let $data;
let $user;
let $notification;
let $q;
let $timeout;

class controller {
  static get $inject() {
    return [
      "$injector",
      "opendash/services/user",
      "opendash/services/data",
      "$q"
    ];
  }

  constructor($injector) {
    $data = $injector.get("opendash/services/data");
    $user = $injector.get("opendash/services/user");
    $notification = $injector.get("opendash/services/notification");
    $q = $injector.get("$q");
    $timeout = $injector.get("$timeout");
  }

  get ready() {
    return $data.ready;
  }

  async $onInit() {
    try {
      await $data.wait();

      this.items = $data.list().map(item => ({
        id: item.id,
        owner: item.owner,
        name: item._name,
        customname: item.name !== item._name ? item.name : ""
      }));

      this.itemsJson = JSON.stringify(this.items, null, "  ");

      await $q.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  async save() {
    try {
      const names = this.items
        .filter(i => i.customname)
        .reduce((acc, i) => Object.assign(acc, { [i.id]: i.customname }), {});

      await $user.setData("settings:data:names", names);

      $data.NameMap = names;

      $notification.success("od.user.settings.data.success");
    } catch (error) {
      $notification.danger("od.user.settings.data.error");
    }
  }
}

let component = {
  template,
  controller: controller
};

export default component;
