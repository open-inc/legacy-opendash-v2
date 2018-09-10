export default class OpenDashSubscription {
    constructor(name = 'default', config = {}) {
        this.name = name;
        this.config = config;
        this.listener = [];
        this.messages = [];
    }

    async on(callback) {
        this.listener.push(callback);

        for(let message of this.messages) {
            try {
                await callback(this.name, message);
            } catch (error) {

            }
        }
    }

    async emit(message) {
        this.messages.push(message);

        for(let callback of this.listener) {
            try {
                await callback(this.name, message);
            } catch (error) {

            }
        }
    }
}
