import _ from "lodash";

import Notification from "./Notification";

import { triggerDigestCycle } from "../services/nghelper.service";

export default class NotificationService {
  constructor() {
    this.notifications = [];
  }

  create(input) {
    const notification = new Notification(input);

    this.notifications.push(notification);

    triggerDigestCycle();
  }

  delete(notification) {
    notification.show = false;
  }

  success(message) {
    return this.create({
      message: message,
      class: "notification--success"
    });
  }

  info(message) {
    return this.create({
      message: message,
      class: "notification--info"
    });
  }

  warning(message) {
    return this.create({
      message: message,
      class: "notification--warning"
    });
  }

  danger(message) {
    return this.create({
      message: message,
      class: "notification--danger"
    });
  }
}
