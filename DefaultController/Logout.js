/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ControllerBase = require('./../ControllerBase');

class Logout extends ControllerBase {
    isAuthEnabled = false;

    async execute(http) {
        http.request.session = null;
        if (http.request.method.toLocaleLowerCase().indexOf("get") > -1) {
            http.response.redirect('/Login');
            return;
        }
        http.response.json({ success: true, message: 'logout' });
    }
}
module.exports = Logout;