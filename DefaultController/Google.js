/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ControllerBase = require('./../ControllerBase');
const Helper = require('./../Helper');
const Utility = require('./../Utility');
const GoogleApi = require('googleapis');
const mongoose = require('mongoose');
const LoginHelper = require('./../LoginHelper');

class Google extends ControllerBase {

    isAuthEnabled = false;
    defaultScope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];
    auth = new GoogleApi.google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRATE,
        process.env.GOOGLE_REDIRECTURI
    );

    async execute(http) {
        if (!Utility.isNullOrEmpty(http.params.code)) {
            //Framework Application Login
            let accountInfo = await this.getGoogleAccountFromCode(http.params.code);
            let resp = await LoginHelper.login({ email: accountInfo.email });
            if (resp.success) {
                http.response.redirect(process.env.GOOGLE_APP_REDIRECT);
            } else {
                const UserModel = mongoose.model("User");
                let userBusiness = new UserModel();
                userBusiness.password = null;
                userBusiness.email = accountInfo.email;
                userBusiness.firstname = accountInfo.given_name;
                userBusiness.lastname = accountInfo.family_name;
                userBusiness.isActive = true;
                await userBusiness.save();

                resp = await LoginHelper.login({ email: accountInfo.email });
                if (resp.success) {
                    http.response.redirect(process.env.GOOGLE_APP_REDIRECT);
                } else {
                    http.response.redirect(process.env.GOOGLE_AUTH_FAIL_REDIRECT);
                }
            }
            return;
        }

        let url = this.getConnectionUrl();
        http.response.redirect(url);
    }

    /**
     * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
     */
    getConnectionUrl() {
        return this.auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
            scope: this.defaultScope
        });
    }

    /**
     * Extract the email and id of the google account from the "code" parameter.
     */
    async getGoogleAccountFromCode(code) {
        const data = await this.auth.getToken(code);
        let jwtParser = new Helper.JWTParser(data.tokens.id_token);
        return jwtParser.Parse();
    }
}
module.exports = Google;