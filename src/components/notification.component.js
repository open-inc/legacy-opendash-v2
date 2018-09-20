import template from "./notification.component.html";

class controller {
  static get $inject() {
    return ["opendash/services/notification"];
  }

  constructor($notification) {
    this.$notification = $notification;
  }
}

let component = {
  controller,
  template,
  bindings: {
    widget: "<"
  }
};

export default component;
