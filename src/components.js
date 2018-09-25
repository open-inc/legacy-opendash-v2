import opendashComponent from "./components/opendash.component";
import routerComponent from "./components/router.component";
import odAuthComponent from "./components/auth.component";
import notificationComponent from "./components/notification.component";
import odLoadingComponent from "./components/loading.component";
import dashboardComponent from "./components/dashboard.component";
import headerComponent from "./components/header.component";
import odWidgetComponent from "./components/widget.component";
import highchartComponent from "./components/highchart.component";
import selectItemComponent from "./components/select-item.component";
import selectLocationComponent from "./components/select-location.component";
import selectStepComponent from "./components/select-step.component";
import selectDateComponent from "./components/select-date.component";
import colorPickerComponent from "./components/color-picker.component";
import fitTextComponent from "./components/fit-text.component";
import odPresetsComponent from "./components/presets.component";

import odWidgetHolderDirective from "./components/widget-holder.directive";
import odTabsDirective from "./components/tabs.directive";
import odTabDirective from "./components/tab.directive";

export default [
  // Core
  ["opendash", opendashComponent],

  ["od-router", routerComponent],
  ["od-auth", odAuthComponent],
  ["od-dashboard", dashboardComponent],
  ["od-notification", notificationComponent],
  ["od-loading", odLoadingComponent],
  ["od-header", headerComponent],
  ["od-widget", odWidgetComponent],
  ["od-presets", odPresetsComponent],

  // Adapter
  ["highchart", highchartComponent],

  // UI
  ["od-select-step", selectStepComponent],
  ["od-select-item", selectItemComponent],
  ["od-select-location", selectLocationComponent],
  ["od-select-date", selectDateComponent],
  ["od-color-picker", colorPickerComponent],

  ["fitText", fitTextComponent],

  // Core
  ["od-widget-holder", odWidgetHolderDirective, true],

  // UI
  ["od-tabs", odTabsDirective, true],
  ["od-tab", odTabDirective, true]
];
