const ControllerBase = require('./../ControllerBase');

class Combo extends ControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
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