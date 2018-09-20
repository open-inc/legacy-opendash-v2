import _ from "lodash";

import template from "./eud.component.html";

let $eud;
let $notification;
let moment;

let standardColors = [
  "#7cb5ec",
  "#434348",
  "#90ed7d",
  "#f7a35c",
  "#8085e9",
  "#f15c80",
  "#e4d354",
  "#2b908f",
  "#f45b5b",
  "#91e8e1"
];

class controller {
  static get $inject() {
    return [
      "opendash/services/eud",
      "opendash/services/notification",
      "moment"
    ];
  }

  constructor(_$eud, _$notification, _moment) {
    $eud = _$eud;
    $notification = _$notification;
    moment = _moment;

    this.first = true;
    this.loading = true;
    this.currentStep = 0;
    this.graph = null;
    this.items = [];
    this.history = [];
    this.settings = {};
    this.selmode = 0;
    this.selunit = "weeks";
    this.selvalue = 10;

    this.init();

    this.watchFunction = history => {
      if (history.unit) {
        this.selmode = 0;
        this.selunit = history.unit;
        this.selvalue = history.value;
      } else if (history.start) {
        this.selmode = 1;
        this.selstart = history.start;
        this.selend = history.end;
      }

      this.settings.history = history;
    };
  }

  $onInit() {
    this.selected = $eud.fixSelected(this.selected);
  }

  init(sort) {
    if (!sort) {
      sort = 1;
    }
    this.sort = sort;
    if (!this.timer) {
      this.timer = 1;
    }
    $eud.getItems().then(items => {
      if (sort == 0) {
        this.items = items;
      } else if (sort == 1) {
        this.items = _.orderBy(
          items,
          [
            item => item.name.toLowerCase(),
            item => item.valueName.toLowerCase()
          ],
          ["asc"]
        );
      } else if (sort == 2) {
        this.items = _.orderBy(items, ["unit", "name", "valueName"], ["asc"]);
      } else {
        this.items = items;
      }
      this.loading = false;
    });
  }

  navigate(step) {
    if (step === "next") {
      return this.navigate(this.currentStep + 1);
    } else if (step === "prev") {
      return this.navigate(this.currentStep - 1);
    }

    this.currentStep = step;

    if (this.currentStep === 4) {
      this.showMoreOptions = false;
      this.finalStep();
    }
  }

  getNavClass(i) {
    const base = "eud__nav__item";

    if (i < this.currentStep) {
      return `${base}--done`;
    }

    if (i === this.currentStep) {
      return `${base}--active`;
    }

    return "";
  }

  selectItem(item) {
    const selected = this.isSelectedItem(item);

    if (selected) {
      _.pull(this.selected, selected);
    } else {
      this.selected.push([item.id, item.value, {}]);
    }
  }

  isSelectedItem(item) {
    return $eud.isSelectedItem(this.selected, item);
  }

  finalStep() {
    this.loading = true;

    this.settings.chart.axisCount = 1;
    this.settings.chart.axisType = 0;

    $eud.getHistory(this.items, this.selected, this.settings).then(history => {
      if (history.length === 0) {
        $notification.create({
          message: "You first need to select an item.",
          class: "notification--danger",
          time: null,
          focus: true
        });
        this.navigate(0);
      }

      this.history = history;

      this.initGraph();
      this.loading = false;
    });
  }

  initGraph() {
    //Set Standard HighchartsColor:
    if (this.first) {
      this.first = false;
      for (var i = 0; i < this.history.length; i++) {
        this.history[i].settings.color = standardColors[i % 10];
      }
    }
    for (var i = 0; i < this.history.length; i++) {
      if (!this.history[i].settings.color) {
        this.history[i].settings.color = standardColors[i % 10];
      }
    }
    this.graph = $eud.getChart(this.history, this.settings);
  }

  addLine(number) {
    let plotLines = [];
    if (number == 0) {
      //Durchschnitt
      for (var i = 0; i < this.history.length; i++) {
        let values = [];
        _.each(this.history[i].history, z => {
          values.push(z.value);
        });
        let mean = _.mean(values);
        plotLines.push({
          id: i + this.history[i].item.id + "-mean",
          name: "Durchschnitt " + this.history[i].item.name,
          value: mean,
          color: this.history[i].settings.color,
          dashStyle: "shortdash",
          width: 2,
          zIndex: 88888,
          label: {
            x: 65,
            zIndex: 999999,
            text:
              "Durchschnitt " +
              this.history[i].item.name +
              " (" +
              mean.toFixed(2) +
              ")"
          }
        });
      }
    } else if (number == 1) {
      //Median
      for (var i = 0; i < this.history.length; i++) {
        let values = [];
        _.each(this.history[i].history, z => {
          values.push(z.value);
        });
        let median = 0;
        values.sort(function(a, b) {
          median = a - b;
        });

        let half = Math.floor(values.length / 2);

        if (values.length % 2) median = values[half];
        else median = (values[half - 1] + values[half]) / 2.0;

        plotLines.push({
          id: i + this.history[i].item.id + "-median",
          name: "Median " + this.history[i].item.name,
          value: median,
          color: this.history[i].settings.color,
          dashStyle: "shortdash",
          width: 2,
          zIndex: 88888,
          label: {
            x: 65,
            zIndex: 999999,
            text:
              "Median " +
              this.history[i].item.name +
              " (" +
              median.toFixed(2) +
              ")"
          }
        });
      }
    } else if (number == 2) {
      //Max
      for (var i = 0; i < this.history.length; i++) {
        let values = [];
        _.each(this.history[i].history, z => {
          values.push(z.value);
        });
        let max = _.max(values);
        plotLines.push({
          id: i + this.history[i].item.id + "-max",
          name: "Maximal " + this.history[i].item.name,
          value: max,
          color: this.history[i].settings.color,
          dashStyle: "shortdash",
          width: 2,
          zIndex: 88888,
          label: {
            x: 65,
            zIndex: 999999,
            text:
              "Maximal " +
              this.history[i].item.name +
              " (" +
              max.toFixed(2) +
              ")"
          }
        });
      }
    } else if (number == 3) {
      //Min
      for (var i = 0; i < this.history.length; i++) {
        let values = [];
        _.each(this.history[i].history, z => {
          values.push(z.value);
        });
        let min = _.min(values);
        plotLines.push({
          id: i + this.history[i].item.id + "-min",
          name: "Minimal " + this.history[i].item.name,
          value: min,
          color: this.history[i].settings.color,
          dashStyle: "shortdash",
          width: 2,
          zIndex: 88888,
          label: {
            x: 65,
            zIndex: 999999,
            text:
              "Minimal " +
              this.history[i].item.name +
              " (" +
              min.toFixed(2) +
              ")"
          }
        });
      }
    } else if (number == 4) {
      //OWN
      if (this.plotNumber && this.plotLabel) {
        plotLines.push({
          id: i + "-" + this.plotNumber + "-" + this.plotLabel,
          name: "Eigene " + this.plotLabel,
          color: "#000000",
          value: this.plotNumber,
          dashStyle: "shortdash",
          width: 2,
          zIndex: 88888,
          label: {
            x: 65,
            zIndex: 999999,
            text: "" + this.plotLabel
          }
        });
      } else {
        // Fehler, keine Daten gefunden
      }
    }
    $eud.setLine(plotLines, this.settings);
    this.graph = $eud.getChart(this.history, this.settings);
  }

  delLine(id) {
    _.remove(this.settings.chart.plotLines, { id: id });
    this.graph = $eud.getChart(this.history, this.settings);
  }

  addAxis() {
    $eud.setAxis(this.history.length, this.settings);
    this.graph = $eud.getChart(this.history, this.settings);
  }

  exportData() {
    for (let index in this.history) {
      let start = moment(this.history[index].history[0].date).format("L");
      let end = moment(
        this.history[index].history[this.history[index].history.length - 1].date
      ).format("L");
      let dataClean = [];
      let duplicateCheck = [];
      this.history[index].history.forEach(function(element) {
        let ignore = false;
        if (duplicateCheck.length < 1) {
          ignore = false;
          duplicateCheck.push(moment(element.date).format("YYYY-MM-DD"));
          duplicateCheck.push(moment(element.date).format("HH:mm:ss"));
        } else {
          if (
            duplicateCheck[0] === moment(element.date).format("YYYY-MM-DD") &&
            duplicateCheck[1] === moment(element.date).format("HH:mm:ss")
          ) {
            ignore = true;
          } else {
            ignore = false;
            duplicateCheck[0] = moment(element.date).format("YYYY-MM-DD");
            duplicateCheck[1] = moment(element.date).format("HH:mm:ss");
          }
        }
        let time = moment(element.date).format("HH:mm:ss");
        let date = moment(element.date).format("YYYY-MM-DD");
        let value = element.value.toLocaleString("de");
        if (!ignore) {
          dataClean.push({ date: date, time: time, value: value });
        }
      });

      let data = this.JSON2CSV(dataClean, this.history[index].item);
      let downloadLink = document.createElement("a");
      let blob = new Blob(["\ufeff", data]);
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download =
        this.history[index].item.name + "(" + start + "-" + end + ").csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  //Helper Function
  JSON2CSV(objArray, meta) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "date;time;value#(" + JSON.stringify(meta) + ")\r\n";
    var line = "";

    if ($("#labels").is(":checked")) {
      let head = array[0];
      if ($("#quote").is(":checked")) {
        for (var index in array[0]) {
          var value = index + "";
          line += '"' + value.replace(/"/g, '""') + '";';
        }
      } else {
        for (var index in array[0]) {
          line += index + ";";
        }
      }

      line = line.slice(0, -1);
      str += line + "\r\n";
    }

    for (let i = 0; i < array.length; i++) {
      var line = "";

      if ($("#quote").is(":checked")) {
        for (var index in array[i]) {
          var value = array[i][index] + "";
          line += '"' + value.replace(/"/g, '""') + '";';
        }
      } else {
        for (var index in array[i]) {
          line += array[i][index] + ";";
        }
      }

      line = line.slice(0, -1);
      str += line + "\r\n";
    }
    return str;
  }

  getLength(object) {
    return Object.keys(object).length;
  }

  applySettings(key, value) {
    this.graph = null;
    _.set(this.settings, key, value);
    this.initGraph();
  }

  action() {
    this.save(this.selected, this.settings);
    this.settings = {};
    this.history = [];
  }
}

let component = {
  template,
  controller,
  bindings: {
    selected: "<",
    settings: "<",
    fixed: "<",
    save: "<"
  }
};

export default component;
