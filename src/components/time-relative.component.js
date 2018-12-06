import moment from "moment";

moment.locale("de");

class TimeRelativeController {
  static get $inject() {
    return ["$element", "$interval"];
  }

  constructor($element, $interval) {
    this.interval = $interval(() => {
      if (this.timestamp) {
        try {
          this.value = moment
            .duration(this.timestamp - new Date().getTime(), "milliseconds")
            .humanize(true);
        } catch (error) {
          this.value = this.timestamp;
        }
      }
    }, 900);
  }

  $onDestroy() {
    this.interval.cancel();
  }
}

let component = {
  template: "{{ $ctrl.value }}",
  controller: TimeRelativeController,
  bindings: {
    timestamp: "<"
  }
};

export default component;
