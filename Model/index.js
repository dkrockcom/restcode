/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Lookup = require('./Lookup');
const LookupType = require('./LookupType');
const NotificationQueue = require('./NotificationQueue');
const DefaultUserModel = require('./User');
const path = require('path');
const fs = require('fs');

class Model {
    static get Lookup() { return Lookup; }
    static get LookupType() { return LookupType; }
    static get NotificationQueue() { return NotificationQueue; }
    static get UserModel() {
        const modelPath = path.resolve('Model/User');
        if (fs.existsSync(modelPath)) {
            return require(modelPath);
        }
        return DefaultUserModel;
    }
}
module.exports = Model;