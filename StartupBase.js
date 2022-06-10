const path = require('path');
const fs = require('fs');
const Framework = require('./index');
const Logger = require('./Helper/Logger');
const NotificationTask = require('./Tasks/NotificationTask');

class StartupBase {
    constructor() {
        this.onConfigure = this.onConfigure.bind(this);
        this.onException = this.onException.bind(this);
        this.onExceptionLog = this.onExceptionLog.bind(this);
        this.onInitialize = this.onInitialize.bind(this);

        if (!fs.existsSync(path.resolve('.env'))) {
            Logger.error("ERROR: Environment File Missing");
            process.kill(process.pid);
        }
        Framework.Initialize(this.onExceptionLog, this.onInitialize);
    }

    async onInitialize(app, server) {
        await this.onConfigure(app, server);
    }

    async onExceptionLog(exception) {
        Logger.error(exception);
        this.onException && this.onException(exception);
    }

    async onConfigure(app, server) {
        Framework.TaskManager.Add(new NotificationTask(), '*/30 * * * * *', "TestTask");
        Framework.TaskManager.Initialize();
    }
}
module.exports = StartupBase;