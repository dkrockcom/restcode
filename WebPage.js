/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HttpContext = require('./Helper/HttpContext');

class WebPage {

    /**
     * Route Parameter which can we be define for page and api http://localhost/user/124, where is 123 is id param
     * @Example { name: "id", required: true }
     */
    routeParams = [];
    route = "";
    /**
     * property for data object which is use for access data on design file while render
     */
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

    /**
     * pageload - Event call when page load
     * @param {HttpContext} http - HttpContext of the current request
     */
    async pageLoad(http) {
        http.response.render(this.route, {
            http: http,
            req: http.request,
            res: http.response,
            next: http.next,
            params: http.params,
            session: http.session,
            data: this.data || {}
        });
    }
    /**
     * setData function use for the set data in  data object which can we access on design file while render
     * @param  {Object} option - Data in object JSON
     */
    setData(option) {
        this.data = Object.assign({}, this.data, option);
    }
}
module.exports = WebPage;