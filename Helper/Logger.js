/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const log4js = require('log4js');

const sizeInMB = 1048576;
const fileSize = (process.env.LOGGER_MAX_FILE_SIZE || 10) * sizeInMB;
const level = process.env.LOGGER_LEVEL || "trace";
let categories = {
    info: { appenders: ["info"], level: 'info' },
    debug: { appenders: ["debug"], level: 'debug' },
    error: { appenders: ["error"], level: 'error' }
}

for (const key in categories) {
    const item = categories[key];
    if (item.level == level || level == "trace") {
        item.appenders.push("console");
    }
}

categories = {
    default: { appenders: ["console", "info", "debug", "error"], level: 'trace' },
    ...categories,
}

log4js.configure({
    appenders: {
        error: { type: 'dateFile', filename: 'logs/error.log', keepFileExt: true, maxLogSize: fileSize },
        info: { type: 'dateFile', filename: 'logs/info.log', keepFileExt: true, maxLogSize: fileSize },
        debug: { type: 'dateFile', filename: 'logs/debug.log', keepFileExt: true, maxLogSize: fileSize },
        console: { type: "console" }
    },
    categories: categories
});

const errorLogger = log4js.getLogger('error');
const debugLogger = log4js.getLogger('debug');
const infoLogger = log4js.getLogger('info');

class Logger {
    static get logger() { return log4js }
    static debug(message, ...args) {
        return debugLogger.debug(message, ...args);
    }

    static error(message, ...args) {
        return errorLogger.error(message, ...args);
    }

    static info(message, ...args) {
        return infoLogger.info(message, ...args);
    }
}
module.exports = Logger;