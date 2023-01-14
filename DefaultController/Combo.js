/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ControllerBase = require('./../ControllerBase');

class Combo extends ControllerBase {
    constructor() {
        super();
        this.isAuthEnabled = false;
    }

    async execute(http) {
        let combos = await this.getCombos(http);
        return {
            success: true,
            combos: combos
        }
    }
};
module.exports = Combo;