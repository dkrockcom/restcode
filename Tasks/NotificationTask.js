/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Notification } = require('./../Notification');
const Logger = require('./../Helper/Logger');

class NotificationTask {
    async execute() {
        Logger.info(`Notification Start ${new Date()}`);
        await Notification.execute();
        Logger.info(`Notification Start ${new Date()}`);
    }
}
module.exports = NotificationTask;