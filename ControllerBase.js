/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const httpContext = require('./Helper/HttpContext');
const mongoose = require('mongoose');
const { controller, messages } = require('./constants');
const { GET, POST, PATCH, PUT, DELETE } = controller.METHOD;

class ControllerBase {

    modelName = null;
    isAuthEnabled = true;
    routeParams = [];
    method = [GET, POST, PATCH, PUT, DELETE];

    response(status, message, data) {
        let option = {
            [controller.responseKey.SUCCESS]: status,
            [controller.responseKey.DATA]: data
        }
        if (message)
            option[controller.responseKey.MESSAGE] = message;

        this._res.json(option);
    }

    get model() {
        return mongoose.model(this.modelName || this.constructor.name);
    }

    async init(req, res, next) {
        this.httpContext = new httpContext(req, res, next);
        if (this.isAuthEnabled && !this.httpContext.isAuthenticated) {
            res.statusCode = 401;
            res.send({ success: false, message: "UNAUTHORIZED_ACCESS" });
            return;
        }
        let toReturn = this.execute && await this.execute(this.httpContext);
        if (toReturn) {
            if (Buffer.isBuffer(toReturn)) {
                res.write(toReturn);
            } else if (toReturn && typeof toReturn === "object") {
                res.json(toReturn);
            } else {
                res.send(toReturn);
            }
            res.end();
        }
    }

    async execute(http) { throw new Error("Not Implemented"); }
    async afterSave(http) { return null; };
    async beforeSave(http) { return null; };
    async beforeLoad(http) { return null; };
    async afterLoad(http) { return null; };
    async beforeDelete(http) { return null; };
    async afterDelete(http) { return null; };

    async getCombos(http) {
        const localLookupListPath = path.resolve('LookupList.js');
        const hasLookupList = fs.existsSync(localLookupListPath);
        let LookupList = null;
        if (hasLookupList) {
            LookupList = require(localLookupListPath);
        } else {
            LookupList = require('./Helper/LookupListBase');
        }
        LookupList = new LookupList();
        LookupList.comboList = http.params["combos"] || [];
        return await LookupList.LoadCombo();
    }
}
module.exports = ControllerBase;