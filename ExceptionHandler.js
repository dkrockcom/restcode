/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class ExceptionHandler {
    constructor() {
        this._callBack = null;
        this._app = null;
    }

    init() {
        process.on('unhandledRejection', (err) => { this._callBack && this._callBack(err); });
        process.on('uncaughtException', (err) => { this._callBack && this._callBack(err); });
        this._app.use((err, req, res, next) => {
            this._callBack && this._callBack(err);
            if (req.path.indexOf('api') > -1) {
                res.json({ success: false, message: err.stack });
            } else {
                res.send(err.stack);
            }
            next(err);
        });
    }
}
module.exports = ExceptionHandler;