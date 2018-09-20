import _ from "lodash";
const clone = _.cloneDeep;

let $data;
let $dashboard;
let $modal;
let $q;
let moment;
export default class EUDService {
  static get $inject() {
    return [
      "opendash/services/data",
      "opendash/services/dashboard",
      "opendash/services/modal",
      "$q",
      "opendash/services/env",
      "opendash/services/header",
      "moment"
    ];
  }

  constructor(_$data, _$dashboard, _$modal, _$q, $env, $header, _moment) {
    $data = _$data;
    $dashboard = _$dashboard;
    $modal = _$modal;
    $q = _$q;
    moment = _moment;
    if (
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >
      580
    ) {
      $header.addSidebarItem({
        icon: "fa-puzzle-piece",
        group: "od.header.widgets.header",
        text: "od.header.widgets.eud",
        action: () => {
          this.newWidget();
        }
      });
    }
  }
  newWidget() {
    let options = {
      width: "1200px",
      controller: [
        "$scope",
        "close",
        function($scope, close) {
          let DEFAULT_SETTINGS = {
            history: {
              aggregation: 1,
              unit: "weeks", // days, weeks, months, years
              value: 10
            },
            chart: {
              type: "time", // time, pie, heatmap
              time_style: "line", // line, area, column,
              pie_style: "circle", // circly, donut
              pie_aggregation: "SUM", // SUM, MEAN, MIN, MAX
              axisCount: 1,
              axisType: 1,
              title: null,
              subTitle: null,
              zoom: true,
              tooltips: true,
              legend: true,
              animation: false,
              yAxisTitleA: ["", "", "", ""],
              plotLines: []
            }
          };
          $scope.fixed = {};
          $scope.selected = {};
          $scope.settings = DEFAULT_SETTINGS;
          $scope.save = function(selected, settings) {
            $dashboard.addWidget({
              name: "Analyse Widget",
              type: "eud-widget",
              grid: [6, 4],
              config: {
                selected,
                settings
              }
            });
            $scope.settings = {};
            $scope.selected = {};
            close();
          };
          $scope.loaded = true;
        }
      ],
      template:
        '<od-eud-editor ng-if="loaded" selected="selected" settings="settings" save="save" ></od-eud-editor>'
    };
    $modal.showModal(options).then(modal => {
      modal.close.then(result => {});
    });
  }
  getItems() {
    return $data.wait().then(() => {
      let items = $data.listByType("Number");
      return _.chain(items)
        .map(item => {
          let i = item[0];
          return {
            id: i.id,
            icon: i.icon,
            name: i.name,
            value: item[1],
            unit: i.valueTypes[item[1]].unit,
            valueName: i.valueTypes[item[1]].name,
            selected: false
          };
        })
        .filter(item => !(item === null))
        .value();
    });
  }

  isSelectedItem(selected, item) {
    const result = selected.filter(e => {
      const [id, valueId] = e;

      return item.id === id && item.value === valueId;
    });

    return result[0];
  }

  filterSelectedItems(selected, items) {
    return _.filter(items, item => this.isSelectedItem(selected, item));
  }

  fixSelected(selected) {
    if (!_.isArray(selected)) {
      if (_.isObject(selected)) {
        selected = _.map(selected, (value, key) => {
          return [key, 0, value];
        });
      } else {
        selected = [];
      }
    }

    return selected;
  }

  getHistory(items, selected, settings) {
    const history = clone(settings.history);

    selected = this.fixSelected(selected);
    items = this.filterSelectedItems(selected, items);

    return $q
      .all(
        _.map(items, item => {
          //Bug Fix
          if (history.unit != "days") {
            if (history.unit == "weeks") {
              history.value = history.value * 7;
            } else if (history.unit == "months") {
              history.value = history.value * 30;
            } else if (history.unit == "years") {
              history.value = history.value * 365;
            }
            history.unit = "days";
          }

          return $data
            .get(item.id)
            .history(history)
            .then(data => {
              let itemSettings = this.isSelectedItem(selected, item)[2];
              itemSettings.name = `${item.name} (${item.valueName})`;
              // itemSettings.color = null;
              return {
                item: item,
                history: data.map(x => ({
                  date: x.date,
                  value: x.value[item.value]
                })),
                settings: itemSettings
              };
            });
        })
      )
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          data[i].history = _.sortBy(data[i].history, "date");
        }
        return _.filter(data, d => d.history.length > 0);
      });
  }

  setLine(plotLines, settings) {
    if (settings.chart.plotLines.length > 0) {
      for (let i = 0; i < plotLines.length; i++) {
        settings.chart.plotLines.push(plotLines[i]);
      }
    } else {
      settings.chart.plotLines = plotLines;
    }
  }

  setAxis(number, settings) {
    settings.chart.axisCount = settings.chart.axisCount + 1;
    settings.chart.axisType = number;
  }

  getChart(items, settings) {
    const highchartConfig = {};
    items = clone(items);
    settings = clone(settings);
    _.set(highchartConfig, "plotOptions.series.animation", false);

    switch (settings.chart.type) {
      default:
        _.set(highchartConfig, "chart.type", getChartType(settings));
        _.set(highchartConfig, "series", getChartSeries(items, settings));
        _.set(highchartConfig, "title.text", settings.chart.title);
        _.set(highchartConfig, "subtitle.text", settings.chart.subtitle);
        _.set(highchartConfig, "yAxis.title.text", settings.chart.yAxisTitle);
        _.set(highchartConfig, "xAxis.title.text", settings.chart.xAxisTitle);
        _.set(highchartConfig, "xAxis.type", "datetime");
        _.set(
          highchartConfig,
          "tooltip.pointFormat",
          "{series.name}: {point.y:.2f}"
        );
        _.set(highchartConfig, "tooltip.xDateFormat", "%Y-%m-%d %H:%M");
        _.set(highchartConfig, "global.useUTC", false);
        _.set(highchartConfig, "useHighStocks", true);
        _.set(highchartConfig, "boost", {
          useGPUTranslations: true
        });
        _.set(highchartConfig, "chart.reflow", false);
        _.set(
          highchartConfig,
          "chart.animation",
          settings.chart.animation ? true : false
        );
        _.set(highchartConfig, "credits.enabled", false);
        _.set(
          highchartConfig,
          "chart.zoomType",
          settings.chart.zoom ? "x" : false
        );
        _.set(
          highchartConfig,
          "plotOptions.series.enableMouseTracking",
          settings.chart.tooltips ? true : false
        );
        _.set(
          highchartConfig,
          "legend.enabled",
          settings.chart.legend ? true : false
        );
        _.set(
          highchartConfig,
          "plotOptions.series.animation",
          settings.chart.animation ? true : false
        );
        _.set(highchartConfig, "plotOptions.line.marker.enabled", false);
        _.set(highchartConfig, "plotOptions.series.turboThreshold", 500);
        break;
    }
    // _.set(highchartConfig, 'plotOptions.series.dataGrouping', {
    //   approximation: 'average',
    //   groupPixelWidth:100,
    //   enable: true,
    //   forced: true,
    //   units: [
    //     [ 'millisecond', [1] ],
    //     [ 'second', [1, 30] ],
    //     [ 'minute', [1, 30] ],
    //     [ 'hour', [1, 12] ],
    //     [ 'day', [1] ],
    //     [ 'week', [1] ],
    //     [ 'month', [1, 6] ],
    //     [ 'year', null ],
    //   ],
    // });
    try {
      if (settings.chart.axisCount == 2) {
        if (settings.chart.axisType == 1) {
          var firstAxis = clone(highchartConfig.yAxis);
          var secondAxis = clone(highchartConfig.yAxis);
          _.set(highchartConfig, "yAxis", []);
          _.get(highchartConfig, "yAxis").push(firstAxis);
          secondAxis.opposite = true;
          secondAxis.linkedTo = 0;
          _.get(highchartConfig, "yAxis").push(secondAxis);
        } else if (settings.chart.axisType == 3) {
          var firstAxis = clone(highchartConfig.yAxis);
          var secondAxis = clone(highchartConfig.yAxis);
          var thirdaxis = clone(highchartConfig.yAxis);
          var series = clone(highchartConfig.series);
          _.set(firstAxis, "labels.style.color", series[0].color);
          _.set(secondAxis, "labels.style.color", series[1].color);
          _.set(thirdaxis, "labels.style.color", series[2].color);
          _.set(firstAxis, "title.style.color", series[0].color);
          _.set(secondAxis, "title.style.color", series[1].color);
          _.set(thirdaxis, "title.style.color", series[2].color);
          _.set(highchartConfig, "yAxis", []);
          _.get(highchartConfig, "yAxis").push(firstAxis);
          _.get(highchartConfig, "yAxis").push(secondAxis);
          thirdaxis.opposite = true;
          _.get(highchartConfig, "yAxis").push(thirdaxis);
          series[1].yAxis = 1;
          series[2].yAxis = 2;
          _.set(highchartConfig, "series", series);
        } else if (settings.chart.axisType == 4) {
          var firstAxis = clone(highchartConfig.yAxis);
          var secondAxis = clone(highchartConfig.yAxis);
          var thirdaxis = clone(highchartConfig.yAxis);
          var fourthaxis = clone(highchartConfig.yAxis);
          var series = clone(highchartConfig.series);
          _.set(firstAxis, "labels.style.color", series[0].color);
          _.set(secondAxis, "labels.style.color", series[1].color);
          _.set(thirdaxis, "labels.style.color", series[2].color);
          _.set(fourthaxis, "labels.style.color", series[3].color);
          _.set(firstAxis, "title.style.color", series[0].color);
          _.set(secondAxis, "title.style.color", series[1].color);
          _.set(thirdaxis, "title.style.color", series[2].color);
          _.set(fourthaxis, "title.style.color", series[3].color);
          _.set(highchartConfig, "yAxis", []);
          _.get(highchartConfig, "yAxis").push(firstAxis);
          _.get(highchartConfig, "yAxis").push(secondAxis);
          thirdaxis.opposite = true;
          fourthaxis.opposite = true;
          _.get(highchartConfig, "yAxis").push(thirdaxis);
          _.get(highchartConfig, "yAxis").push(fourthaxis);
          series[1].yAxis = 1;
          series[2].yAxis = 2;
          series[3].yAxis = 3;
          _.set(highchartConfig, "series", series);
        } else {
          var firstAxis = clone(highchartConfig.yAxis);
          var secondAxis = clone(highchartConfig.yAxis);
          var series = clone(highchartConfig.series);
          _.set(firstAxis, "labels.style.color", series[0].color);
          _.set(secondAxis, "labels.style.color", series[1].color);
          _.set(firstAxis, "title.style.color", series[0].color);
          _.set(secondAxis, "title.style.color", series[1].color);
          _.set(highchartConfig, "yAxis", []);
          _.get(highchartConfig, "yAxis").push(firstAxis);
          secondAxis.opposite = true;
          _.get(highchartConfig, "yAxis").push(secondAxis);
          series[1].yAxis = 1;
          _.set(highchartConfig, "series", series);
        }
      } else if (settings.chart.axisCount > 2) {
        if (settings.chart.axisType == 2) {
          if (settings.chart.axisCount % 2 == 0) {
            var firstAxis = highchartConfig.yAxis;
            var secondAxis = clone(highchartConfig.yAxis);
            var series = clone(highchartConfig.series);
            _.set(firstAxis, "labels.style.color", series[0].color);
            _.set(secondAxis, "labels.style.color", series[1].color);
            _.set(firstAxis, "title.style.color", series[0].color);
            _.set(secondAxis, "title.style.color", series[1].color);
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            secondAxis.opposite = true;
            _.get(highchartConfig, "yAxis").push(secondAxis);
            series[1].yAxis = 1;
            _.set(highchartConfig, "series", series);
          } else {
            var firstAxis = highchartConfig.yAxis;
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            var series = clone(highchartConfig.series);
            series[1].yAxis = 0;
            _.set(highchartConfig, "series", series);
          }
        } else if (settings.chart.axisType == 3) {
          if (settings.chart.axisCount % 2 == 0) {
            var firstAxis = highchartConfig.yAxis;
            var secondAxis = clone(highchartConfig.yAxis);
            var thirdaxis = clone(highchartConfig.yAxis);
            var series = clone(highchartConfig.series);
            _.set(firstAxis, "labels.style.color", series[0].color);
            _.set(secondAxis, "labels.style.color", series[1].color);
            _.set(thirdaxis, "labels.style.color", series[2].color);
            _.set(firstAxis, "title.style.color", series[0].color);
            _.set(secondAxis, "title.style.color", series[1].color);
            _.set(thirdaxis, "title.style.color", series[2].color);
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            _.get(highchartConfig, "yAxis").push(secondAxis);
            thirdaxis.opposite = true;
            _.get(highchartConfig, "yAxis").push(thirdaxis);
            series[1].yAxis = 1;
            series[2].yAxis = 2;
            _.set(highchartConfig, "series", series);
          } else {
            var firstAxis = highchartConfig.yAxis;
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            var series = clone(highchartConfig.series);
            series[1].yAxis = 0;
            series[2].yAxis = 0;
            _.set(highchartConfig, "series", series);
          }
        } else if (settings.chart.axisType == 4) {
          if (settings.chart.axisCount % 2 == 0) {
            var firstAxis = highchartConfig.yAxis;
            var secondAxis = highchartConfig.yAxis;
            var thirdaxis = clone(highchartConfig.yAxis);
            var fourthaxis = clone(highchartConfig.yAxis);
            var series = clone(highchartConfig.series);
            _.set(firstAxis, "labels.style.color", series[0].color);
            _.set(secondAxis, "labels.style.color", series[1].color);
            _.set(thirdaxis, "labels.style.color", series[2].color);
            _.set(fourthaxis, "labels.style.color", series[3].color);
            _.set(firstAxis, "title.style.color", series[0].color);
            _.set(secondAxis, "title.style.color", series[1].color);
            _.set(thirdaxis, "title.style.color", series[2].color);
            _.set(fourthaxis, "title.style.color", series[3].color);
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            _.get(highchartConfig, "yAxis").push(secondAxis);
            thirdaxis.opposite = true;
            fourthaxis.opposite = true;
            _.get(highchartConfig, "yAxis").push(thirdaxis);
            _.get(highchartConfig, "yAxis").push(fourthaxis);
            series[1].yAxis = 1;
            series[2].yAxis = 2;
            series[3].yAxis = 3;
            _.set(highchartConfig, "series", series);
          } else {
            var firstAxis = highchartConfig.yAxis;
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            var series = clone(highchartConfig.series);
            series[1].yAxis = 0;
            _.set(highchartConfig, "series", series);
          }
        } else {
          if (settings.chart.axisCount % 2 == 1) {
            var firstAxis = highchartConfig.yAxis;
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
          } else {
            var firstAxis = highchartConfig.yAxis;
            var secondAxis = clone(highchartConfig.yAxis);
            _.set(highchartConfig, "yAxis", []);
            _.get(highchartConfig, "yAxis").push(firstAxis);
            secondAxis.opposite = true;
            secondAxis.linkedTo = 0;
            _.get(highchartConfig, "yAxis").push(secondAxis);
          }
        }
      }
      //Check Axis for Labels
      let axisCount = clone(highchartConfig.yAxis);
      if (axisCount.length == 2) {
        //2 Achsen
        _.set(
          highchartConfig,
          "yAxis[0].title.text",
          settings.chart.yAxisTitleA[0] ? settings.chart.yAxisTitleA[0] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[1].title.text",
          settings.chart.yAxisTitleA[1] ? settings.chart.yAxisTitleA[1] : ""
        );
      } else if (axisCount.length == 3) {
        //3 Achsen
        _.set(
          highchartConfig,
          "yAxis[0].title.text",
          settings.chart.yAxisTitleA[0] ? settings.chart.yAxisTitleA[0] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[1].title.text",
          settings.chart.yAxisTitleA[1] ? settings.chart.yAxisTitleA[1] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[2].title.text",
          settings.chart.yAxisTitleA[2] ? settings.chart.yAxisTitleA[2] : ""
        );
      } else if (axisCount.length == 4) {
        //4 Achse
        _.set(
          highchartConfig,
          "yAxis[0].title.text",
          settings.chart.yAxisTitleA[0] ? settings.chart.yAxisTitleA[0] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[1].title.text",
          settings.chart.yAxisTitleA[1] ? settings.chart.yAxisTitleA[1] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[2].title.text",
          settings.chart.yAxisTitleA[2] ? settings.chart.yAxisTitleA[2] : ""
        );
        _.set(
          highchartConfig,
          "yAxis[3].title.text",
          settings.chart.yAxisTitleA[3] ? settings.chart.yAxisTitleA[3] : ""
        );
      }
      //Plotlines to Axis
      if (!axisCount.length || axisCount.length == 1) {
        //1 Achse
        if (!axisCount.length) {
          _.set(
            highchartConfig,
            "yAxis.plotLines",
            settings.chart.plotLines ? settings.chart.plotLines : null
          );
        } else {
          _.set(
            highchartConfig,
            "yAxis[0].plotLines",
            settings.chart.plotLines ? settings.chart.plotLines : null
          );
        }
      } else if (axisCount.length >= 2) {
        //Mehr als 2 Achsen
        if (settings.chart.plotLines) {
          let plotLineArray = [];
          for (var x = 0; x < axisCount.length; x++) {
            plotLineArray[x] = [];
          }
          for (let i = 0; i < settings.chart.plotLines.length; i++) {
            for (let j = 0; j < axisCount.length; j++) {
              if (
                settings.chart.plotLines[i].color ===
                axisCount[j].title.style.color
              ) {
                plotLineArray[j].push(settings.chart.plotLines[i]);
              }
            }
          }
          for (var x = 0; x < axisCount.length; x++) {
            _.set(
              highchartConfig,
              "yAxis[" + x + "].plotLines",
              plotLineArray[x] ? plotLineArray[x] : null
            );
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return highchartConfig;
  }
}

function getChartSeries(items, settings) {
  switch (settings.chart.type) {
    case "time":
      let series = [];
      _.each(items, item => {
        let serie = {};
        (serie.name = item.settings.name),
          (serie.color = item.settings.color),
          (serie.dataGrouping = {
            approximation: "average",
            enable: true,
            forced: true,
            units: [
              ["millisecond", [1]],
              ["second", [1, 30]],
              ["minute", [1, 30]],
              ["hour", [1, 12]],
              ["day", [1]],
              ["week", [1]],
              ["month", [1, 6]],
              ["year", null]
            ]
          }),
          (serie.data = []);
        _.each(item.history, z => {
          serie.data.push([z.date.valueOf(), z.value]);
        });
        series.push(serie);
      });
      return series;
    case "pie":
      return [
        {
          name: "Pie Chart",
          innerSize: settings.chart.pie_style === "donut" ? "60%" : "0%",
          data: _.map(items, item => ({
            name: `${item.item.name} (${item.item.valueName})`,
            y: getPieChartAggregation(item.history, settings)
          }))
        }
      ];
    default:
      return [];
  }
}

function getPieChartAggregation(history, settings) {
  let result = 0;
  const values = _.map(history, h => h.value);
  switch (settings.chart.pie_aggregation) {
    case "SUM":
      result = _.sum(values);
      break;
    case "MEAN":
      result = _.mean(values);
      break;
    case "MAX":
      result = _.max(values);
      break;
    case "MIN":
      result = _.min(values);
      break;
  }
  return _.round(result, 3);
}

function getChartType(settings) {
  if (settings.chart.type === "time") {
    return settings.chart.time_style;
  }
  if (settings.chart.type === "pie") {
    return "pie";
  }
  if (settings.chart.type === "heatmap") {
    return "heatmap";
  }
  if (settings.chart.type === "histogramm") {
    if (settings.chart.histo_style === "absolute") {
      return "histogram";
    } else {
      return "columnrange";
    }
  }
  if (settings.chart.type === "spider") {
    return "line";
  }
  return "series";
}
