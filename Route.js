/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');

const ignoreList = [
    'setRoute',
    '_express',
    'apiPrefix'
];

const defaultCtrl = require('./DefaultController');

class Route {
    constructor(app) {
        this.setRoute = this.setRoute.bind(this);
        this._express = app;
        this.apiPrefix = null;

        if (fs.existsSync(path.resolve('Controller'))) {
            const controllers = fs.readdirSync('Controller');
            controllers.forEach(ctrl => {
                const ctrlName = ctrl.split(".")[0];
                this[ctrlName] = require(`${path.resolve('Controller')}/${ctrl}`);
            });
        }

        //Default controller it can be override
        Object.keys(defaultCtrl).forEach(ctrlName => {
            if (!this.hasOwnProperty(ctrlName)) {
                this[ctrlName] = defaultCtrl[ctrlName];
            }
        });
    }

    init() {
        let ctrls = Object.keys(this);
        ctrls.forEach(this.setRoute);
        // if (defaultCtrl.hasOwnProperty(ctrl)) {

        // }
    }

    getRouteParams(params) {
        let rpString = '';
        params.forEach(item => {
            rpString += `/:${item.name}${item.required ? '' : '?'}`;
        });
        return rpString;
    }

    setRoute(ctrl, index) {
        if (ignoreList.findIndex(e => e == ctrl) == -1) {
            let obj = this[ctrl];
            let routeParams = '';

            // if (!defaultCtrl.hasOwnProperty(ctrl)) {
            //     return;
            // }
            obj = new obj();
            if (obj.routeParams && obj.routeParams.length > 0) {
                routeParams = this.getRouteParams(obj.routeParams);
            }

            // if (Business[ctrl]) {
            //     let businessObject = new Business[ctrl];
            //     obj._context = businessObject;
            // }

            if (this.apiPrefix === '')
                this.apiPrefix = null;

            this._express.route(`${this.apiPrefix ? `/${this.apiPrefix}` : ''}/${ctrl}${routeParams}`)
                .get(obj.init.bind(obj))
                .post(obj.init.bind(obj));
        }
    }
}
module.exports = Route;  