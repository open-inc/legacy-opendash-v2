import _ from "lodash";

import Logger from "../helper/logger";

const logger = Logger("opendash/services/user");

let adapter;

const waitingForAdapter = [];
const waitingForAuth = [];

export default class UserService {
  constructor() {
    this.loading = true;
    this.auth = false;
    this.user = null;
  }

  get adapter() {
    return adapter ? true : false;
  }

  init(_adapter) {
    adapter = _adapter;

    waitingForAdapter.forEach(resolve => resolve());
    waitingForAdapter.length = 0;

    adapter.init().then(() => this.checkAuth());
  }

  async wait(skipAuth = false) {
    logger.log("Method Call: wait()");

    return new Promise((resolve, reject) => {
      if (skipAuth && adapter) {
        return resolve();
      } else {
        waitingForAdapter.push(resolve);
      }

      if (!skipAuth && this.auth) {
        return resolve();
      } else {
        waitingForAuth.push(resolve);
      }
    });
  }

  async checkAuth() {
    await this.wait(true);

    logger.log("Method Call: checkAuth()");

    return adapter
      .checkAuth()
      .then(user => {
        this.user = user;
        this.auth = true;
        this.loading = false;

        waitingForAuth.forEach(resolve => resolve());
        waitingForAuth.length = 0;

        return this.auth;
      })
      .catch(error => {
        this.auth = false;
        this.loading = false;
        logger.error("checkAuth() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] checkAuth() failed.")
        );
      });
  }

  async login(credentials) {
    await this.wait(true);

    logger.log("Method Call: login()");

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

    return adapter
      .login(credentials.email, credentials.password)

      .then(user => {
        console.log(user);
        this.user = user;
        return this.checkAuth();
      })
      .catch(error => {
        logger.error("login() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] login() failed.")
        );
      });
  }

  async logout() {
    await this.wait(true);

    logger.log("Method Call: logout()");

    try {
      let message = { id: 0, user: "", pass: "" };
      window.webkit.messageHandlers.userlogging.postMessage(message);
    } catch (e) {
      logger.log(e);
    }

    return adapter
      .logout()
      .then(() => {
        window.localStorage.clear();
        window.location.reload();
        return true;
      })
      .catch(error => {
        logger.error("logout() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] logout() failed.")
        );
      });
  }

  async register(credentials) {
    await this.wait(true);

    logger.log("Method Call: register()");

    return adapter
      .register(credentials)
      .then(user => {
        this.user = user;
        return true;
      })
      .catch(error => {
        logger.error("register() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] register() failed.")
        );
      });
  }

  async getData(key) {
    await this.wait();

    logger.log(`Method Call: getData(${key})`);

    return adapter
      .getData(key)
      .then(response => {
        return JSON.parse(response);
      })
      .catch(error => {
        logger.error("getData() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] getData() failed.")
        );
      });
  }

  async setData(key, value) {
    await this.wait();

    logger.log(`Method Call: setData(${key})`);

    return adapter
      .setData(key, JSON.stringify(value))
      .then(response => {
        return true;
      })
      .catch(error => {
        logger.error("setData() failed.");
        return Promise.reject(
          error || new Error("[opendash/services/user] setData() failed.")
        );
      });
  }

  async listDashboards(data) {
    await this.wait();

    logger.log("Method Call: listDashboards()");

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
  }

  async getDashboard(id) {
    await this.wait();

    logger.log("Method Call: getDashboard()");

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
  }

  async setDashboard(dashboard) {
    await this.wait();

    logger.log("Method Call: setDashboard()");

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
  }

  async deleteDashboard(id) {
    await this.wait();

    logger.log("Method Call: getDashboard()");

    try {
      if (adapter.deleteDashboard) {
        let result = await adapter.deleteDashboard(id);
        return result;
      } else {
        let meta = await this.getData(`dashboard`);

        _.pull(meta.dashboards, id);

        await this.setData(`dashboard`, meta);
        await this.setData(`dashboard:${id}`, null);

        return true;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async createDashboard(dashboard) {
    await this.wait();

    logger.log("Method Call: createDashboard()");

    try {
      if (adapter.createDashboard) {
        return await adapter.createDashboard(dashboard);
      } else {
        let meta = await this.getData(`dashboard`);

        if (!dashboard.id) {
          dashboard.id = uuidv4();
        }

        if (!meta.dashboards) {
          meta.dashboards = [];
        }

        meta.dashboards.push(dashboard.id);

        await this.setData(`dashboard`, meta);

        await this.setData(`dashboard:${dashboard.id}`, dashboard);

        return dashboard.id;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async getCurrentLocations() {
    await this.wait();

    logger.log("Method Call: getCurrentLocations()");

    try {
      if (adapter.getCurrentLocations) {
        return await adapter.getCurrentLocations();
      } else {
        return await this.getData("location:current");
      }
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async setCurrentLocations(ids) {
    await this.wait();

    logger.log("Method Call: setCurrentLocations()");

    try {
      if (adapter.setCurrentLocations) {
        return await adapter.setCurrentLocations(ids);
      } else {
        return await this.setData("location:current", ids);
      }
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async listLocations(...args) {
    await this.wait();

    logger.log("Method Call: listLocations()");
    try {
      return await adapter.listLocations(...args);
    } catch (error) {
      logger.assert(false, "Error on method call: listLocations(): \n" + error);
    }
  }

  async listUsers(...args) {
    await this.wait();

    logger.log("Method Call: listUsers()");
    try {
      return await adapter.listUsers(...args);
    } catch (error) {
      logger.assert(false, "Error on method call: listUsers(): \n" + error);
    }
  }

  async shareDashboardWithUser(...args) {
    await this.wait();

    logger.log("Method Call: shareDashboardWithUser()");
    try {
      return await adapter.shareDashboardWithUser(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: shareDashboardWithUser(): \n" + error
      );
    }
  }

  async listSharedData(...args) {
    await this.wait();

    logger.log("Method Call: listSharedData()");
    try {
      return await adapter.listSharedData(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: listSharedData(): \n" + error
      );
    }
  }

  async createSharedData(...args) {
    await this.wait();

    logger.log("Method Call: createSharedData()");
    try {
      return await adapter.createSharedData(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: createSharedData(): \n" + error
      );
    }
  }

  async deleteSharedData(...args) {
    await this.wait();

    logger.log("Method Call: deleteSharedData()");
    try {
      return await adapter.deleteSharedData(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: deleteSharedData(): \n" + error
      );
    }
  }

  async getKeyValueData(...args) {
    await this.wait();

    logger.log("Method Call: getKeyValueData()");
    try {
      return await adapter.getKeyValueData(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: getKeyValueData(): \n" + error
      );
    }
  }

  async createKeyValueDat(...args) {
    await this.wait();

    logger.log("Method Call: createKeyValueData()");
    try {
      return await adapter.createKeyValueData(...args);
    } catch (error) {
      logger.assert(
        false,
        "Error on method call: createKeyValueData(): \n" + error
      );
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
