/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Logger = require('./Helper/Logger');

const externalModelsPath = path.resolve('./Model');
const internalModelsPath = path.resolve('node_modules/rest-code/Model');
const ngg = require('./Model');

const delay = (time) => {
    if (!time) {
        throw new Error("delay Time cannot be empty, delay(time)");
    };
    return new Promise((res) => {
        setTimeout(() => {
            res(null);
        }, Number(time));
    });
}

class Database {
    static async registerSchema() {
        console.log(process.cwd());
        if (fs.existsSync(externalModelsPath)) {
            const externalModels = fs.readdirSync(externalModelsPath);
            externalModels.forEach(key => require(modelPath));
        }

        if (fs.existsSync(internalModelsPath)) {
            const internalModels = fs.readdirSync(internalModelsPath);
            internalModels.forEach(key => { require(path.join(internalModelsPath, `${key}`)) });
        }
    }

    static connect() {
        mongoose.connection.on('error', function (e) {
            Logger.info("db: mongodb error", e);
            // reconnect here
        });

        mongoose.connection.on('connected', function () {
            Logger.info('db: mongodb connected');
        });

        mongoose.connection.on('disconnecting', function () {
            Logger.info('db: mongodb is disconnecting!!!');
        });

        mongoose.connection.on('disconnected', function () {
            Logger.info('db: mongodb is disconnected!!!');
        });

        mongoose.connection.on('reconnected', function () {
            Logger.info('db: mongodb is reconnected');
        });

        mongoose.connection.on('timeout', function (e) {
            Logger.info("db: mongodb timeout", e);
            // reconnect here
        });

        mongoose.connection.on('close', function () {
            Logger.info('db: mongodb connection closed');
        });

        mongoose.connect(process.env.DATABASE, {
            keepAlive: true,
            maxPoolSize: 100
        });
    }
}
module.exports = Database;