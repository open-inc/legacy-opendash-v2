// Fork of highcharts-ng (https://github.com/pablojim/highcharts-ng) @74dc0b079cfa45f5a238fbe5a33b04eb96053c6c

class HighchartComponentController {

    static get $inject() {
        return ['$element', '$timeout']; 
    }

    constructor($element, $timeout) {
        let initialized = false;
        let seriesId = 0;
        let yAxisId = 0;
        let xAxisId = 0;
        let ctrl = this;
        let prevConfig = {};
        let mergedConfig = {};
        let detector = ctrl.changeDetection || angular.equals;

        this.$onInit = function () {
            initChart();
            initialized = true;
        };

        this.$onChanges = function (changesObject) {
            if (changesObject.config && changesObject.config.currentValue !== undefined) {
                if (!initialized) {
                    return;
                }
                initChart();
            }
        };

        this.removeItems = function (newItems, chartItems, id, toIgnore) {
            if (newItems && Array.isArray(newItems)) {
                let ids = ensureIds(newItems, id);
                for (let i = chartItems.length - 1; i >= 0; i -= 1) {
                    let a = chartItems[i];
                    if ((toIgnore.indexOf(a.options.id) < 0) && (ids.indexOf(a.options.id) < 0)) {
                        //if we don't set redraw to true, it can create
                        //glitches in the chart's rendering where the series
                        //doesn't completely re-render
                        a.remove(true);
                    }
                }
            }
        };

        this.removeUnlinkedObjects = function (mergedConfig) {
            /*
       Removes unlinked objects, items that have been removed in the config,
       but not yet removed from the HighChart object
       */
            //First check to see if there are any axes that need to be removed
            //If a series is linked to the axis, it will be removed by HighCharts
            this.removeItems(mergedConfig.yAxis, ctrl.chart.yAxis, yAxisId, 'navigator-y-axis');
            this.removeItems(mergedConfig.xAxis, ctrl.chart.xAxis, xAxisId, 'navigator-x-axis');
            this.removeItems(mergedConfig.series, ctrl.chart.series, seriesId, 'highcharts-navigator-series');
            //TODO do we need to handle removing series from the config that highcharts has removed as part
            //of removing axes?
        };

        this.addAnyNewAxes = function (configAxes, chart, isX) {
            if (configAxes && Array.isArray(configAxes)) {
                angular.forEach(configAxes, function (s) {
                    if (!chart.get(s.id)) {
                        chart.addAxis(s, isX);
                    }
                });
            }
        };

        this.$doCheck = function () {
            let hasChanged = ctrl.config !== prevConfig;

            if (!hasChanged && ctrl.enableChangeDetection === true) {
                hasChanged = !detector(ctrl.config, prevConfig);
            }

            if (hasChanged) {
                prevConfig = ctrl.config;
                mergedConfig = getMergedOptions($element, ctrl.config, seriesId);

                //Remove any unlinked objects before adding
                this.removeUnlinkedObjects(mergedConfig);

                //Allows dynamic adding Axes
                this.addAnyNewAxes(mergedConfig.yAxis, ctrl.chart, false);
                this.addAnyNewAxes(mergedConfig.xAxis, ctrl.chart, true);

                //Allows dynamic adding of series
                if (mergedConfig.series) {
                    // Add any new series
                    angular.forEach(ctrl.config.series, function (s) {
                        if (!ctrl.chart.get(s.id)) {
                            ctrl.chart.addSeries(s);
                        }
                    });
                }

                ctrl.chart.update(mergedConfig, true);
            }
        };

        this.$onDestroy = function () {
            if (ctrl.chart) {
                try {
                    ctrl.chart.destroy();
                } catch (ex) {
                    // fail silently as highcharts will throw exception if element doesn't exist
                }

                $timeout(function () {
                    $element.remove();
                }, 0);
            }
        };

        function initChart() {
            prevConfig = ctrl.config;
            mergedConfig = getMergedOptions($element, ctrl.config, seriesId);
            ctrl.chart = new Highcharts[getChartType(mergedConfig)](mergedConfig);
            ctrl.config.getChartObj = function () {
                return ctrl.chart;
            };

            // Fix resizing bug
            // https://github.com/pablojim/highcharts-ng/issues/550
            let originalWidth = $element[0].clientWidth;
            let originalHeight = $element[0].clientHeight;
            $timeout(function () {
                if ($element[0].clientWidth !== originalWidth || $element[0].clientHeight !== originalHeight) {
                    ctrl.chart.reflow();
                }
            }, 0, false);
        }
    }
}

export default {
    controller: HighchartComponentController,
    bindings: {
        config: '<',
        changeDetection: '<',
        enableChangeDetection: '<',
        changeCounter: '<',
    },
};

function getMergedOptions(element, config, seriesId) {
    let mergedOptions = {};

    let defaultOptions = {
        chart: {
            events: {},
        },
        title: {},
        subtitle: {},
        series: [],
        credits: {},
        plotOptions: {},
        navigator: {},
    };

    if (config) {
    //check all series and axis ids are set
        if (config.series) {
            ensureIds(config.series, seriesId);
        }

        mergedOptions = angular.merge(defaultOptions, config);
    } else {
        mergedOptions = defaultOptions;
    }
    mergedOptions.chart.renderTo = element[0];

    //check chart type is set
    return mergedOptions;
}

const chartTypeMap = {
    'stock': 'StockChart',
    'map': 'Map',
    'chart': 'Chart',
};

function getChartType(config) {
    if (config === undefined || config.chartType === undefined) return 'Chart';
    return chartTypeMap[('' + config.chartType).toLowerCase()];
}

function ensureIds(chartCollection, collectionId) {
    /*
   Ensures each item in the iteratble chartCollection has an id,
   and if not auto-generates one incrementing collectionId
   */
    let ids = [];
    angular.forEach(chartCollection, function (s) {
        if (!angular.isDefined(s.id)) {
            collectionId += 1;
            s.id = 'cc-' + collectionId;
        }
        ids.push(s.id);
    });

    return ids;
}
