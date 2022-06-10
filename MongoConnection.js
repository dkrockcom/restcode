/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const externalModelsPath = path.resolve('./Model');
const ngg = require('./Model')

class Database {
    static registerSchema() {
        console.log(process.cwd());
        if (fs.existsSync(externalModelsPath)) {
            const externalModels = fs.readdirSync(externalModelsPath);
            externalModels.forEach(key => { require(`${externalModelsPath}/${key}`); });
        }

        const internalModels = fs.readdirSync(path.resolve('./Model'));
        internalModels.forEach(key => { require(path.resolve(`./Model/${key}`)); });
    }

    static connect() {
        mongoose.connect(process.env.DATABASE, {
            keepAlive: true,
            maxPoolSize: 100
        });

        mongoose.connection.on('error', function (e) {
            console.log("db: mongodb error " + e);
            // reconnect here
        });

        mongoose.connection.on('connected', function () {
            console.log('db: mongodb connected');
        });

        mongoose.connection.on('disconnecting', function () {
            console.log('db: mongodb is disconnecting!!!');
        });

        mongoose.connection.on('disconnected', function () {
            console.log('db: mongodb is disconnected!!!');
        });

        mongoose.connection.on('reconnected', function () {
            console.log('db: mongodb is reconnected');
        });

        mongoose.connection.on('timeout', function (e) {
            console.log("db: mongodb timeout " + e);
            // reconnect here
        });

        mongoose.connection.on('close', function () {
            console.log('db: mongodb connection closed');
        });
    }
}
module.exports = Database;