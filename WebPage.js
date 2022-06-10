/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HttpContext = require('./Helper/HttpContext');

class WebPage {

    routeParams = [];
    route = "";
    httpHelper = null;
    data = {};

    constructor() {
        this.pageLoad = this.pageLoad.bind(this);
    }

    async init(req, res, next) {
        let httpContext = new HttpContext(req, res, next);
        if (this.isAuthEnabled && !httpContext.isAuthenticated) {
            return res.redirect('/Login');
        }
        this.pageLoad(httpContext);
    }

    async pageLoad(http) {
        http.response.render(this.route, {
            req: http.request,
            res: http.response,
            next: http.next,
            params: http.params,
            session: http.session,
            data: this.data || {}
        });
    }

    setData(option) {
        this.data = Object.assign({}, this.data, option);
    }

    setBootstrapAlert(message, type, subMessage) {
        this.data = Object.assign({}, this.data, {
            alert: { message, type, subMessage }
        });
    }
}
module.exports = WebPage;