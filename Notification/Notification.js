/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Logger = require('./../Helper/Logger');
const NotificationParams = require('./NotificationParams');
const EmailEngine = require("./EmailEngine");
const TextEngine = require("./TextEngine");
const mongoose = require('mongoose');

class Notification {

    static get NotificationQueue() {
        return mongoose.model("NotificationQueue");
    }

    /**
     * Function for add email in queue for process
     * @param  {NotificationParams} params - NotificationParams class instance
     */
    static async sendEmail(param = new NotificationParams()) {
        let nq = new this.NotificationQueue({
            to: param.to,
            from: param.from,
            subject: param.subject,
            body: param.body,

            //Optional fields
            cc: param.cc,
            bcc: param.bcc,

            //Management fields
            type: NotificationParams.NotificationType.Email, //Email/Text
            isSent: false,
            isHtml: param.isHtml,
            attachments: param.attachments
        });
        await nq.save();
    }


    /**
     * Function for add sms in table for process
     * @param  {NotificationParams} params - NotificationParams class instance
     */
    static async sendText(param = new NotificationParams()) {
        let nq = new NotificationQueue({
            to: param.to,
            body: param.body,
            //Management fields
            type: NotificationParams.NotificationType.Text,
            isSent: false
        });
        await nq.save();
    }

    /**
     * Function for send email instant without email queue
     * @param  {NotificationParams} params - NotificationParams class instance
     */
    static async sendInstantEmail(params) {
        let ee = new EmailEngine();
        return await ee.sendMail(params);
    }

    /**
     * Function for send SMS instant without email queue
     * @param  {NotificationParams} params - NotificationParams class instance
     */
    static async sendInstantText(params) {
        let te = new TextEngine();
        return await te.sendText(params);
    }

    //Execute - Function Fired from the JOB/Task
    static async execute() {
        try {
            //for now picking only Email Notifications only, as SMS notificaiton is not Implemented
            let results = await NotificationQueue.find({ isSent: false, type: 0, retryCount: { $lte: 2 } });
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                let param = new NotificationParams(result._doc);
                try {
                    let isSent = false;
                    switch (result.type) {
                        case NotificationParams.NotificationType.Email:
                            isSent = await this.sendInstantEmail(param);
                            break;

                        case NotificationParams.NotificationType.Text:
                            isSent = await this.sendInstantText(param);
                            break;

                        default:
                            isSent = await this.sendInstantEmail(param);
                            break;
                    }
                    await this.updateRecord(result, isSent);
                } catch (ex) {
                    //If SMTP Fail then update record too for prevent to loop
                    await this.updateRecord(result, false);
                    Logger.error(ex);
                }
            }
        } catch (ex) {
            Logger.error(ex);
        }
    }

    //Update email record
    static async updateRecord(record, status) {
        try {
            let retryCount = record.retryCount;
            retryCount++;

            let updateOption = {
                isSent: status,
                retryCount: retryCount
            }
            if (status) {
                updateOption.sentOn = new Date();
            }
            await NotificationQueue.updateOne({ _id: record.id }, { $set: updateOption });
        } catch (ex) {
            Logger.error(ex);
        }
    }
}
module.exports = Notification;