const Notification = require('./Notification');
const NotificationParams = require('./NotificationParams');

class NotificationInfo {
    static get Notification() { return Notification; }
    static get NotificationParams() { return NotificationParams; }
}
module.exports = NotificationInfo;