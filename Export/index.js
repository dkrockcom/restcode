/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Excel = require('./Excel');
const CSV = require('./CSV');
const PDF = require('./PDF');

class Export {
    static get Excel() { return Excel; }
    static get CSV() { return CSV; }
    static get PDF() { return PDF; }
}
module.exports = Export;