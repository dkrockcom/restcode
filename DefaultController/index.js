/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Logout = require('./Logout');
const Login = require('./Login');
const Google = require('./Google');
const ForgotPassword = require('./ForgotPassword');
const Combo = require('./Combo');
const ChangePassword = require('./ChangePassword');

module.exports = {
    Logout: Logout,
    Login: Login,
    Google: Google,
    ForgotPassword: ForgotPassword,
    Combo: Combo,
    ChangePassword: ChangePassword
}