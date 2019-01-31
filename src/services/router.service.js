import Router from "../classes/Router";

const router = new Router();

router.addRoute("opendash.core.dashboard", "/dashboard", "od-dashboard", true);
router.addRoute(
  "opendash.core.user.settings.data",
  "/user/settings/data",
  "od-user-settings-data"
);
router.addRoute(
  "opendash.core.dashboard.show",
  "/dashboard/:dashboard",
  "od-dashboard"
);

export default router;
