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
  }
}
