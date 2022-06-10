/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Utility = require('../Utility');

class HttpContext {

    constructor(req, res, next) {
        this._request = req;
        this._response = res;
        this._next = next;
    }

    static get roleAdmin() { return "Admin" }
    static get roleSuperAdmin() { return "SuperAdmin" }

    get request() { return this._request }
    get response() { return this._response }
    get next() { return this._next }
    get session() { return this._request.session }
    get params() {
        let _params = {};
        let params = Object.assign({}, this.request.body, this.request.params, this.request.query);

        let keys = Object.keys(params);
        for (let index = 0; index < keys.length; index++) {
            let key = keys[index];
            _params[key] = Utility.validateParams(params[key]);
        }
        if (!Utility.isNullOrEmpty(params.filters)) {
            params.filters = Utility.deSerializeObject(params.filters, {});
        }
        if (!Utility.isNullOrEmpty(params.combos)) {
            params.combos = Utility.deSerializeObject(params.combos, []);
        }
        return _params;
    }
    get files() { return this.request.files || [] }
    get absoluteUrl() {
        return `${this.request.protocol}://${this.request.headers.host}`
    }
    get isAuthenticated() { return this.session && this.session.isAuthenticated }
    get userId() { return this.session && this.session.userId || null }
    get roles() { return this.session && this.session.roles || [] }
    get modules() { return this.session && this.session.modules || [] }
    get ipAddress() {
        //TODO:
        return ""
    }
    get isAdmin() { return this.IsInRole(HttpContext.roleAdmin); }
    get isSuperAdmin() { return this.IsInRole(HttpContext.roleAdmin) || this.isInRole(HttpContext.roleSuperAdmin); }

    isInRole(role) {
        let result = this.roles.findIndex(e => e.roleName.toLocaleLowerCase() === role.toLocaleLowerCase()) > -1
        return result;
    }

    hasAccess(requiredRoles) {
        let hasAccess = false;
        requiredRoles = requiredRoles.split(",");
        for (let index = 0; index < this.roles.length; index++) {
            const role = this.roles[index];
            if (requiredRoles.find(e => e.trim() === role.trim())) {
                hasAccess = true;
                break;
            }
        }
        return hasAccess;
    }
}
module.exports = HttpContext;