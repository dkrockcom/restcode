/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Notification = require('./Notification');
const NotificationParams = require('./NotificationParams');

class NotificationInfo {
    static get Notification() { return Notification; }
    static get NotificationParams() { return NotificationParams; }
}
module.exports = NotificationInfo;