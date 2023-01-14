/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const md5 = require('md5');
const fs = require("fs");
const path = require('path');

class Utility {

    /**
     * camelCase - Function for convert string to camel case string word
     * @param  {String} str - string value
     */
    static camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static get passwordHashRound() { return 8 };

    /**
     * isNullOrEmpty - Function for check value null or empty string or undefined
     * @param {String} - Value which need to check.
     */
    static isNullOrEmpty(val) {
        return val === "" || val === undefined || val === null;
    }

    /**
     * toInt - Convert value to Integer
     * @param  {Value} value - Value for conver to integer
     * @param  {Number} defaultValue - Default value which can send while call the function
     */
    static toInt(value, defaultValue) {
        let val = null;
        try {
            val = Number(value);
        } catch (ex) {
            val = defaultValue;
        }
        return val;
    }

    static getParams(params) {
        let value = {};
        try {
            value = JSON.parse(params.data);
        } catch (ex) {
            value = {};
        }
        return value;
    }

    /**
     * generateHash - Craete MD5 Hash Value
     * @param  {String} value - String value for convert to md5
     */
    static generateHash(value) {
        return md5(value);
    }

    /**
     * getDirectoryList - Fetch all Directory List from specific location
     * @param pathFormRoot Directory Path from root.
     */
    static getDirectoryList(pathFormRoot) {
        return fs.readdirSync(pathFormRoot, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }

    /**
     * validateParams - Validate Parameters
     * @param  {Value} str
     */
    static validateParams(str) {
        if (typeof str !== 'string') return str;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return (type === '[object Object]' || type === '[object Array]') ? result : str;
        } catch (err) {
            return str;
        }
    }
    /**
     * generateUUID - Use for Generate unique id number
     * @param  {Date} performance - Date parameter which is optional
     */
    static generateUUID(performance) {
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    /**
     * viewFormat - Data unit view
     * @param  {Number} num 
     * @param  {Number} digits
     */
    static viewFormat(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
    /**
     * deSerializeObject - Convert json string to json
     * @param  {String} value - String value which need to convert
     * @param  {JSON} defaultValue - Default value which will requrn if conversion failed
     */
    static deSerializeObject(value, defaultValue = {}) {
        let returnValue = defaultValue;
        try {
            if (value && typeof (value) !== 'object') {
                returnValue = JSON.parse(value);
            } else {
                returnValue = value;
            }
        } catch (ex) {
            throw ex;
        }
        return returnValue;
    }
}
module.exports = Utility;