import Logger from "../helper/logger";

const logger = Logger("opendash/services/user");

const logging = true;

export default class UserService {
  static get $inject() {
    return [
      "od.user.adapter",
      "$q",
      "lodash",
      "opendash/services/notification",
      "$timeout"
    ];
  }

  constructor(adapter, $q, _, $notification, $timeout) {
    const waiting = [];

    this.loading = true;
    this.auth = false;
    this.user = null;

    adapter
      .init()
      .then(() => $timeout())
      .then(() => this.checkAuth());

    this.checkAuth = () => {
      if (logging) logger.log("Method Call: checkAuth()");

      return $q
        .resolve(adapter.checkAuth())
        .then(user => {
          this.user = user;
          this.auth = true;
          this.loading = false;

          waiting.forEach(resolve => resolve());
          waiting.length = 0;

          return this.auth;
        })
        .catch(error => {
          this.auth = false;
          this.loading = false;
          logger.error("checkAuth() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] checkAuth() failed.")
          );
        });
    };

    this.login = credentials => {
      if (logging) logger.log("Method Call: login()");

      try {
        let message = {
          id: 1,
          user: credentials.email,
          pass: credentials.password
        };
        window.webkit.messageHandlers.userlogging.postMessage(message);
      } catch (e) {
        logger.log(e);
      }

      return $q
        .resolve(adapter.login(credentials.email, credentials.password))
        .then(user => {
          this.user = user;
          return this.checkAuth();
        })
        .catch(error => {
          logger.error("login() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] login() failed.")
          );
        });
    };

    this.logout = () => {
      if (logging) logger.log("Method Call: logout()");

      try {
        let message = { id: 0, user: "", pass: "" };
        window.webkit.messageHandlers.userlogging.postMessage(message);
      } catch (e) {
        logger.log(e);
      }

      return $q
        .resolve(adapter.logout())
        .then(() => {
          window.localStorage.clear();
          window.location.reload();
          return true;
        })
        .catch(error => {
          logger.error("logout() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] logout() failed.")
          );
        });
    };

    this.register = credentials => {
      if (logging) logger.log("Method Call: register()");

      return $q
        .resolve(adapter.register(credentials))
        .then(user => {
          this.user = user;
          return true;
        })
        .catch(error => {
          logger.error("register() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] register() failed.")
          );
        });
    };

    this.getData = key => {
      if (logging) logger.log("Method Call: getData()");

      return $q
        .resolve(adapter.getData(key))
        .then(response => {
          return JSON.parse(response);
        })
        .catch(error => {
          logger.error("getData() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] getData() failed.")
          );
        });
    };

    this.setData = (key, value) => {
      if (logging) logger.log("Method Call: setData()");

      return $q
        .resolve(adapter.setData(key, JSON.stringify(value)))
        .then(response => {
          return true;
        })
        .catch(error => {
          logger.error("setData() failed.");
          return $q.reject(
            error || new Error("[opendash/services/user] setData() failed.")
          );
        });
    };

    this.wait = () => {
      if (logging) logger.log("Method Call: wait()");

      return $q((resolve, reject) => {
        if (this.auth) {
          resolve();
        } else {
          waiting.push(resolve);
        }
      });
    };

    this.listDashboards = async data => {
      if (logging) logger.log("Method Call: listDashboards()");

      try {
        if (adapter.listDashboards) {
          let result = await adapter.listDashboards();
          return result;
        } else {
          return (await this.getData("dashboard")).dashboards || [];
        }
      } catch (error) {
        return [];
      }
    };

    this.getDashboard = async id => {
      if (logging) logger.log("Method Call: getDashboard()");

      try {
        if (adapter.getDashboard) {
          let result = await adapter.getDashboard(id);
          return result;
        } else {
          return await this.getData(`dashboard:${id}`);
        }
      } catch (error) {
        logger.error(error);
      }
    };

    this.setDashboard = async dashboard => {
      if (logging) logger.log("Method Call: setDashboard()");

      try {
        if (adapter.setDashboard) {
          let result = await adapter.setDashboard(dashboard);
          return result;
        } else {
          return await this.setData(`dashboard:${dashboard.id}`, dashboard);
        }
      } catch (error) {
        logger.error(error);
      }
    };

    this.deleteDashboard = async id => {
      if (logging) logger.log("Method Call: getDashboard()");

      try {
        if (adapter.deleteDashboard) {
          let result = await adapter.deleteDashboard(id);
          return result;
        } else {
          return await this.getData(`dashboard:${id}`);
        }
      } catch (error) {
        logger.error(error);
      }
    };

    this.createDashboard = async ({
      name = "Home",
      widgets = [],
      id = uuidv4(),
      version = 2
    }) => {
      if (logging) logger.log("Method Call: createDashboard()");

      try {
        if (adapter.createDashboard) {
          let result = await adapter.createDashboard({
            name,
            widgets,
            id,
            version
          });
          return result;
        } else {
          let meta = await this.getData(`dashboard`);

          if (meta.version === version) {
            if (!meta.dashboards) {
              meta.dashboards = [];
            }

            meta.dashboards.push(id);

            await this.setData(`dashboard`, meta);
          }

          await this.setData(`dashboard:${id}`, {
            id,
            version,
            name,
            widgets
          });

          return id;
        }
      } catch (error) {
        logger.error(error);
      }
    };

    const optionalMethods = [
      "listUsers",
      "shareDashboardWithUser",
      "listSharedData",
      "createSharedData",
      "deleteSharedData",
      "getKeyValueData",
      "createKeyValueData"
    ];

    for (const method of optionalMethods) {
      if (adapter[method] && typeof adapter[method] === "function") {
        this[method] = async (...args) => {
          if (logging) logger.log(`Method Call: ${method}()`);
          return await adapter[method](...args);
        };
      }
    }
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
