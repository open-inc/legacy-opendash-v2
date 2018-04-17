/*eslint no-console: ["off"] */

export default function logger(namespace) {
    return {
        log(...args) {
            console.log(`[${namespace}]`, ...args);
        },
        warn(...args) {
            console.warn(`[${namespace}]`, ...args);
        },
        error(...args) {
            console.error(`[${namespace}]`, ...args);
        },
    };
}
