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