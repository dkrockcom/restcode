/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const md5 = require("md5");
const mongoose = require('mongoose');
const Logger = require('./Helper/Logger');

class LoginHelper {
    static async login(args, http) {
        let response = { success: false, message: "Please Enter Valid credentials" };
        if (args.password) {
            args.password = this.passwordHash(args.password);
        }
        const copyArgs = JSON.parse(JSON.stringify(args));
        delete copyArgs["password"];
        let userRecord = await mongoose.model("User").findOne(copyArgs);
        if (!userRecord) {
            response.message = "User not registered";
            return response;
        }
        if (userRecord && userRecord.password === args.password) {
            const userdata = userRecord._doc;
            delete userdata["password"];
            response.success = true;
            response.user = userdata;
            response.message = "Logged In";
            const options = {
                maxAge: (24 * 60 * 60 * 1000), // 24 hours
                signed: true // Indicates if the cookie should be signed
            }
            http.request.session.user = userdata;
            http.request.session.userId = userdata._id;
            http.request.session.isAuthenticated = true;
            http.request.sessionOptions = options;
            //TODO:
            // http.request.session.Roles = roles || [];
            // http.request.session.Modules = [];
        }
        return response;
    }

    static async changePassword({ userId, password }) {
        const response = { success: false, message: "Password not changed" };
        try {
            const newePassword = this.passwordHash(password);
            await mongoose.model("User").updateOne({ _id: userId }, { $set: { password: newePassword } });
            response.success = true;
            response.message = "Password successfully changed";
        } catch (ex) {
            response.message = ex.message;
            Logger.error(ex);
        }
        return response;
    }

    static passwordHash(password) {
        return md5(password);
    }
}
module.exports = LoginHelper;