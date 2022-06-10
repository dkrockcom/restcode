/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const JWTParser = require('./JWTParser');
const CustomLookupInfo = require('./CustomLookupInfo');
const LookupListBase = require('./LookupListBase');

class Helper {
    static get JWTParser() { return JWTParser; }
    static get CustomLookupInfo() { return CustomLookupInfo; }
    static get LookupListBase() { return LookupListBase; }
}
module.exports = Helper;