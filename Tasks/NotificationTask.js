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