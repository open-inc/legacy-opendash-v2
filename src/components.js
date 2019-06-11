import opendashComponent from "./components/opendash.component";
import userSettingsDataComponent from "./components/user-settings-data.component";
import userSettingsAccountComponent from "./components/user-settings-account.component";
import routerComponent from "./components/router.component";
import odAuthComponent from "./components/auth.component";
import notificationComponent from "./components/notification.component";
import odLoadingComponent from "./components/loading.component";
import dashboardComponent from "./components/dashboard.component";
import dashboardEditModalComponent from "./components/dashboard-edit-modal.component";
import headerComponent from "./components/header.component";
import odWidgetComponent from "./components/widget.component";
import highchartComponent from "./components/highchart.component";
import formComponent from "./components/form.component";
import selectItemComponent from "./components/select-item.component";
import selectIconComponent from "./components/select-icon.component";
import selectLocationComponent from "./components/select-location.component";
import selectStepComponent from "./components/select-step.component";
import selectDateComponent from "./components/select-date.component";
import colorPickerComponent from "./components/color-picker.component";
import fitTextComponent from "./components/fit-text.component";
import timeRelativeComponent from "./components/time-relative.component";
import odPresetsComponent from "./components/presets.component";
import defaultModalComponent from "./components/default-modal.component";

import odWidgetHolderDirective from "./components/widget-holder.directive";
import odTabsDirective from "./components/tabs.directive";
import odTabDirective from "./components/tab.directive";

export default [
  // Core
  ["opendash", opendashComponent],

  ["od-router", routerComponent],
  ["od-auth", odAuthComponent],
  ["od-dashboard", dashboardComponent],
  ["od-dashboard-edit-modal", dashboardEditModalComponent],
  ["od-notification", notificationComponent],
  ["od-loading", odLoadingComponent],
  ["od-header", headerComponent],
  ["od-widget", odWidgetComponent],
  ["od-presets", odPresetsComponent],

  ["od-user-settings-data", userSettingsDataComponent],
  ["od-user-settings-account", userSettingsAccountComponent],

  // Adapter
  ["highchart", highchartComponent],

  // UI
  ["od-form", formComponent],
  ["od-select-step", selectStepComponent],
  ["od-select-icon", selectIconComponent],
  ["od-select-item", selectItemComponent],
  ["od-select-location", selectLocationComponent],
  ["od-select-date", selectDateComponent],
  ["od-color-picker", colorPickerComponent],
  ["od-default-modal", defaultModalComponent],

  ["fitText", fitTextComponent],
  ["od-time-relative", timeRelativeComponent],

  // Core
  ["od-widget-holder", odWidgetHolderDirective, true],

  // UI
  ["od-tabs", odTabsDirective, true],
  ["od-tab", odTabDirective, true]
];
