/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const md5 = require("md5");
const { UserModel } = require('./Model');
const Logger = require('./Helper/Logger');
const Utility = require('./Utility');

class LoginHelper {

    /**
     * login - function for Login / authenticate and set cookies
     * @param  {Object} args - User authentication credentials
     * @param  {Object} http - Http context of current request
     */
    static async login(args, http) {
        let response = { success: false, message: "Please Enter Valid credentials" };
        if (args.password) {
            args.password = Utility.generateHash(args.password);
        }
        const userRecord = await UserModel.findOne(args);
        if (userRecord) {
            response.success = true;
            response.user = userRecord._doc;
            response.message = "Logged In";
            const options = {
                maxAge: (24 * 60 * 60 * 1000), // 24 hours
                signed: true // Indicates if the cookie should be signed
            }
            http.request.session.user = userRecord;
            http.request.session.userId = userRecord._id;
            http.request.session.isAuthenticated = true;
            http.request.sessionOptions = options;
            //TODO:
            // http.request.session.Roles = roles || [];
            // http.request.session.Modules = [];
        }
        return response;
    }
    /**
     * changePassword - function for change user password
     * @param  {Object} { userId, password }
     */
    static async changePassword({ userId, password }) {
        const response = { success: false, message: "Password not changed" };
        try {
            const newePassword = Utility.generateHash(password);
            await UserModel.updateOne({ _id: userId }, { $set: { password: newePassword } });
            response.success = true;
            response.message = "Password successfully changed";
        } catch (ex) {
            response.message = ex.message;
            Logger.error(ex);
        }
        return response;
    }
}
module.exports = LoginHelper;