import OpenDashSubscription from '../classes/Subscription';

export default class OpenDashMultiSubscription {
    constructor(config = {}) {
        this.config = config;
        this.subscriptions = {};
    }

    async on(name, callback) {
        if (!this.subscriptions[name]) {
            this.subscriptions[name] = new OpenDashSubscription(name, this.config);
        }

        await this.subscriptions[name].on(callback);
    }

    async emit(name, message) {
        if (!this.subscriptions[name]) {
            this.subscriptions[name] = new OpenDashSubscription(name, this.config);
        }

        await this.subscriptions[name].emit(message);
    }
}
