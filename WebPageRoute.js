/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const Utility = require('./Utility');
const path = require('path');

class WebPageRoute {
    constructor(app) {
        this.app = app;
        this.init();
    }

    get webDir() { return path.resolve('Web'); }

    init() {
        const webDefaultPagePath = path.resolve('Web/Pages/Default');
        let dpc = new (require(path.resolve(webDefaultPagePath)));
        dpc.route = webDefaultPagePath;
        this.app.route("/")
            .get(dpc.init.bind(dpc))
            .post(dpc.init.bind(dpc));
    }

    getRouteRouteParams(params) {
        let rpString = '';
        params.forEach(item => {
            rpString += `/:${item.name}${item.required ? '' : '?'}`;
        });
        return rpString;
    }

    setView(route, dir) {
        let r = path.join((route ? route : `${this.webDir}`), dir);
        let pclass = new (require(r))();
        pclass.route = r;
        let routeRouteParams = '';
        if (pclass.routeParams && pclass.routeParams.length > 0) {
            routeRouteParams = this.getRouteRouteParams(pclass.routeParams);
        }

        let fullRoute = r.split("Pages")[1];
        fullRoute = fullRoute.replace(/\\/g, "/");
        this.app.route(`${fullRoute}${routeRouteParams}`)
            .get(pclass.init.bind(pclass))
            .post(pclass.init.bind(pclass));
    }

    setRoute(route) {
        if (fs.existsSync(this.webDir)) {
            const dirList = Utility.getDirectoryList(route ? route : this.webDir);
            dirList.forEach(dir => {
                if (dir !== "Common") {
                    const childDirList = Utility.getDirectoryList(path.join((route ? route : `${this.webDir}`), dir));
                    if (childDirList.length > 0) {
                        route && this.setView(route, dir);
                        this.setRoute(path.join((route ? route : `${this.webDir}`), dir));
                    } else {
                        this.setView(route, dir);
                    }
                }
            });
        }
    }
}

module.exports = WebPageRoute;