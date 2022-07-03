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

const loadModels = (modelsPath) => {
    if (fs.existsSync(modelsPath)) {
        const models = fs.readdirSync(modelsPath);
        models.forEach(key => {
            const modelName = key.split(".")[0];
            if (mongoose.models.hasOwnProperty(modelName)) {
                delete mongoose.models[modelName];
            }
            require(path.join(modelsPath, `${key}`))
        });
    }
}

class Database {
    static async connect() {

        // Load internal models
        loadModels(internalModelsPath);
        // Load external models
        loadModels(externalModelsPath);

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

        await mongoose.connect(process.env.DATABASE, {
            keepAlive: true,
            maxPoolSize: 1000
        });
    }
}
module.exports = Database;