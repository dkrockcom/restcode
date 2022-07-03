/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ControllerBase = require('./../ControllerBase');
const mongoose = require('mongoose');
const Utility = require('./../Utility');
const { NotificationParams, Notification } = require("./../Notification");

class ForgotPassword extends ControllerBase {
    isAuthEnabled = false;

    async execute(http) {
        let response = { success: false, message: '' };
        try {
            let email = http.params["Email"];
            if (Utility.isNullOrEmpty(email)) {
                response.message = "Please Enter valid email";
                return http.response.json(response);
            }
            email = email.trim();

            let result = await mongoose.model("User").findOne({ email: email });
            if (result) {
                let hash = Utility.generateUUID();
                await mongoose.model("User").updateOne({ _id: result._id }, {
                    $set: {
                        passKey: hash,
                        passwordResetRequestOn: new Date()
                    }
                });
                let np = new NotificationParams();
                np.to = email;
                np.cc = 'admin@codehuntz.com';
                np.subject = `${process.env.APP_NAME} - Forgot Password`;
                np.tags = {
                    LOGO: 'data:image/png;base64,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',
                    HASH: hash
                };
                np.body = `<html>
                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            /* FONTS */
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }
                    
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }
                    
                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }
                    
                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }
                    
                            img {
                                -ms-interpolation-mode: bicubic;
                            }
                    
                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }
                    
                            table {
                                border-collapse: collapse !important;
                            }
                    
                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }
                    
                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }
                    
                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="#7c72dc" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                                <img alt="Logo" src="{LOGO}" width="200" height="120"
                                                    style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;"
                                                    border="0">
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- HERO -->
                            <tr>
                                <td bgcolor="#7c72dc" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top"
                                                style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Trouble signing in?</h1>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- COPY BLOCK -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="680">
                                        <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left"
                                                style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Resetting your password is easy. Just press the button below and
                                                    follow the instructions. We'll have you up and running in no time. </p>
                                            </td>
                                        </tr>
                                        <!-- BULLETPROOF BUTTON -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#7c72dc">
                                                                        <span 
                                                                            style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #7c72dc; display: inline-block;">
                                                                            {HASH}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- FOOTER -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480">
                    
                                        <!-- PERMISSION REMINDER -->
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="left"
                                                style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                                                <p style="margin: 0;">You received this email because you requested a password reset. If you
                                                    did not, <a href="{WEB_LINK}" target="_blank"
                                                        style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    
                    </html>`;
                Notification.sendEmail(np);
                response.success = true;
                response.message = 'Password reset link sent to your email';
            } else {
                response.message = "User not found";
            }
        } catch (ex) {
            response.success = false;
            response.message = ex.message;
        }
        return response;
    }
}
module.exports = ForgotPassword;