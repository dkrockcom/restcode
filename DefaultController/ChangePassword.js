/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ControllerBase = require('./../ControllerBase');
const LoginHelper = require('./../LoginHelper');

class ChangePassword extends ControllerBase {
    isAuthEnabled = true;

    async execute(http) {
        const response = await LoginHelper.login({ email: http.params.email, password: http.params.password });
        if (response.success) {
            return await LoginHelper.changePassword({ userId: response.user._id, password: http.params.newPassword });
        }
        return response;
    }
};
module.exports = ChangePassword;