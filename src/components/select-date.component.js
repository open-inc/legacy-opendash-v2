import lodash from "lodash";
import moment from "moment";

import template from "./select-date.component.html";


import Logger from "../helper/logger";

let $translate;

const logger = Logger("od.ui.select-date");

let NumberToMonth = {
  0: "Januar",
  1: "Februar",
  2: "März",
  3: "April",
  4: "Mai",
  5: "Juni",
  6: "Juli",
  7: "August",
  8: "September",
  9: "Oktober",
  10: "November",
  11: "Dezember"
};

let NumberToMonthEN = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

const MonthToNumber = lodash.invert(NumberToMonth);
const MonthToNumberEN = lodash.invert(NumberToMonthEN);

const ALLOWED_MODES = ["relative", "start-end", "since"];

class controller {

  static get $inject() {
    return ["$injector"];
  }
 

  constructor($injector) {
    $translate = $injector.get("$translate");
    this.dateA = moment()
      .date(1)
      .startOf("day");
    this.dateB = moment().endOf("day");
    this.now = moment();

    this._value = 1;
    this._unit = "days";
    this.currentMode = ALLOWED_MODES[0];

    $translate("od.js.month1").then(translate => {
      NumberToMonth[0] = translate;
    });
    $translate("od.js.month2").then(translate => {
      NumberToMonth[1] = translate;
    });
    $translate("od.js.month3").then(translate => {
      NumberToMonth[2] = translate;
    });
    $translate("od.js.month4").then(translate => {
      NumberToMonth[3] = translate;
    });
    $translate("od.js.month5").then(translate => {
      NumberToMonth[4] = translate;
    });
    $translate("od.js.month6").then(translate => {
      NumberToMonth[5] = translate;
    });
    $translate("od.js.month7").then(translate => {
      NumberToMonth[6] = translate;
    });
    $translate("od.js.month8").then(translate => {
      NumberToMonth[7] = translate;
    });
    $translate("od.js.month9").then(translate => {
      NumberToMonth[8] = translate;
    });
    $translate("od.js.month10").then(translate => {
      NumberToMonth[9] = translate;
    });
    $translate("od.js.month11").then(translate => {
      NumberToMonth[10] = translate;
    });
    $translate("od.js.month12").then(translate => {
      NumberToMonth[11] = translate;
    });

    

  }

  $onInit() {
    if (!lodash.isFunction(this.watch)) {
      throw new Error(
        "Bad usage of od-select-date watch attribute. Must be a Function."
      );
    }

    if (lodash.isObject(this.config)) {
      Object.assign(this, this.config);
    }

    if (this.mode) {
      if (ALLOWED_MODES.indexOf(this.mode) < 0) {
        logger.warn(
          `Bad usage of od-select-date mode attribute: Mode must be ${ALLOWED_MODES.join(
            "|"
          )}. '${ALLOWED_MODES[0]}' will be used instead of '${this.mode}'`
        );
      } else {
        this.currentMode = this.mode;
      }
    }

    if (this.selmode) {
      this.currentMode = ALLOWED_MODES[parseInt(this.selmode)];
    }

    if (this.selunit) {
      this._unit = this.selunit;
    }

    if (this.selvalue) {
      this._value = parseInt(this.selvalue);
    }

    if (this.selstart) {
      this.dateA = moment(this.selstart).startOf("day");
    }

    if (this.selend) {
      this.dateB = moment(parseInt(this.selend)).endOf("day");
    }

    this.change();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (value < 1) {
      value = 1;
    }
    this._value = value;
    this.change();
  }

  get unit() {
    return this._unit;
  }

  set unit(unit) {
    this._unit = unit;
    this.change();
  }

  get dayA() {
    return this.dateA.date();
  }

  set dayA(value) {
    this.dateA.date(value);
  }

  get monthA() {
    return NumberToMonth[this.dateA.month()];
  }

  set monthA(value) {
    if($translate.use() === "de") {
      this.dateA.month(MonthToNumber[value]);
    } else {
      this.dateA.month(MonthToNumberEN[value]);
    }
  }

  get yearA() {
    return this.dateA.year();
  }

  set yearA(value) {
    this.dateA.year(value);
  }

  get dayB() {
    return this.dateB.date();
  }

  set dayB(value) {
    this.dateB.date(value);
  }

  get monthB() {
    return NumberToMonth[this.dateB.month()];
  }

  set monthB(value) {
    if($translate.use() === "de") {
      this.dateB.month(MonthToNumber[value]);
    } else {
      this.dateB.month(MonthToNumberEN[value]);
    }
  }

  get yearB() {
    return this.dateB.year();
  }

  set yearB(value) {
    this.dateB.year(value);
  }

  get dayArrayA() {
    const response = [];

    for (let i = 1; i <= this.dateA.daysInMonth(); i++) {
      response.push(i);
    }

    return response;
  }

  get dayArrayB() {
    const response = [];

    for (let i = 1; i <= this.dateB.daysInMonth(); i++) {
      response.push(i);
    }

    return response;
  }

  get monthArrayA() {
    return lodash.map(NumberToMonth, x => x);
  }

  get monthArrayB() {
    return lodash.map(NumberToMonth, x => x);
  }

  get yearArrayA() {
    const response = [];

    for (let i = moment().year(); i >= 1970; i--) {
      response.push(i);
    }

    return response;
  }

  get yearArrayB() {
    const response = [];

    for (let i = moment().year(); i >= 1970; i--) {
      response.push(i);
    }

    return response;
  }

  change(b) {
    if (this.currentMode === "start-end") {
      if (this.dateA.isAfter(this.dateB)) {
        if (b) {
          this.dateA = this.dateB.clone();
        } else {
          this.dateB = this.dateA.clone();
        }
      }
      this.watch({
        start: this.dateA.clone().valueOf(),
        end: this.dateB.clone().valueOf()
      });
    }

    if (this.currentMode === "since") {
      this.watch({
        since: this.dateA.clone().valueOf()
      });
    }

    if (this.currentMode === "relative") {
      this.watch({
        unit: this.unit,
        value: this.value
      });
    }
  }

  diff(a, b) {
    return b.diff(a, "days");
  }
}

let component = {
  controller,
  template,
  bindings: {
    config: "<",
    mode: "@",
    selmode: "<",
    selunit: "<",
    selvalue: "<",
    selstart: "<",
    selend: "<",
    watch: "<"
  }
};

export default component;
