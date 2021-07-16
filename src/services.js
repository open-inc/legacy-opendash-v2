import userService from "./services/user.service";
import locationService from "./services/location.service";
import dataService from "./services/data.service";
import eventService from "./services/event.service";
import dashboardService from "./services/dashboard.service";
import envService from "./services/env.service";
import modalService from "./services/modal.service";
import notificationService from "./services/notification.service";
import presetsService from "./services/presets.service";
import headerService from "./services/header.service";
import routerService from "./services/router.service";
import { isDateUnit } from "./components/data.display.datetime"
import highlightService from "./services/highlight.service";
import stringmapService from "./services/stringmap.service";
export default [
  ["user", userService, true],
  ["location", locationService, true],
  ["data", dataService],
  ["event", eventService],
  ["modal", modalService],
  ["notification", notificationService, true],
  ["presets", presetsService],
  ["dashboard", dashboardService],
  ["header", headerService],
  ["env", envService, true],
  ["router", routerService, true],
  ["date", isDateUnit, true],
  ["highlight", highlightService, true],
  ["stringmap", stringmapService, true]
];
