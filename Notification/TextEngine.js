const twilioLib = require('twilio');
const NotificationParams = require('./NotificationParams');
const Logger = require('./../Helper/Logger');

class TextEngine {

    constructor(cconfig = {}) {
        this.config = Object.assign({}, twilio, cconfig);
    }

    /**
    * @desc Send text message to
    * @param {NotificationParams} - parameters
    */
    async sendText(params = new NotificationParams()) {
        const { accountId, token } = this.config;
        let client = new twilioLib(accountId, token);
        return await (
            new Promise((resolve) => {
                client.messages.create({
                    body: params.Body,
                    to: params.To,  // Text this number
                    from: config.twilio.from // From a valid Twilio number
                }).then((res) => {
                    resolve(true);
                }, (err) => {
                    Logger.error(err);
                    resolve(false);
                });
            })
        )
    }
}
module.exports = TextEngine;