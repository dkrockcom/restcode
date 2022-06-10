/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const winston = require('winston');
const { combine, timestamp, prettyPrint, errors } = winston.format;
require('winston-daily-rotate-file');

const createTransport = ({ level, customFileName, ...others }) => {
    return new winston.transports.DailyRotateFile({
        filename: `logs/%DATE%/${customFileName || level}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        prepend: true,
        level: level,
        maxDays: 0,
        maxSize: '10m',
        ...others
    });
};

const infoLog = createTransport({ level: 'info', handleExceptions: false });
const errorLog = createTransport({ level: 'error', handleExceptions: true });
const debugLog = createTransport({ level: 'debug', handleExceptions: false });
const consoleLogs = new winston.transports.Console({ handleExceptions: true, level: process.env.NODE_ENV === "production" ? 'warn' : undefined });

let transports = [
    infoLog, errorLog, debugLog, consoleLogs
];

const logger = winston.createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp(),
        prettyPrint()
    ),
    transports: transports
});
module.exports = logger;