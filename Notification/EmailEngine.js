/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const nodemailer = require('nodemailer');
const NotificationParams = require('./NotificationParams');
const Logger = require('./../Helper/Logger');

class EmailEngine {

    constructor(config = {}) {
        config = {
            ...{
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: JSON.parse(process.env.SMTP_SECURE),
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: true
                },
                ignoreTLS: JSON.parse(process.env.SMTP_IGNORE_TLS)
            },
            ...config
        }
        this.transporter = nodemailer.createTransport(config);
    }

    async sendMail(option = new NotificationParams()) {
        try {
            let emailoption = {
                to: option.to,
                from: option.from,
                subject: option.subject,
                cc: option.cc,
                bcc: option.bcc
            };
            emailoption[option.isHtml ? "html" : "text"] = option.body;
            let isConnectionOK = await this.transporter.verify();
            if (!isConnectionOK) {
                return isConnectionOK;
            }
            //TODO: Need to veriy is mail sent or falied
            const resp = await this.transporter.sendMail(emailoption);
            return true;
        } catch (ex) {
            Logger.error(ex);
            return false;
        }
    }
};
module.exports = EmailEngine;