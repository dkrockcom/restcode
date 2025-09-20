/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CustomLookupInfo = require('./CustomLookupInfo');
const Utility = require('../Utility');
const mongoose = require('mongoose');

class LookupListBase {
    constructor() {
        this.comboList = [];
        this.comboData = {};
        this.notFound = [];
    }

    get Lookup() { return mongoose.model("Lookup"); }
    get LookupType() { return mongoose.model("LookupType"); }

    async LoadCombo() {
        let results = [];
        if (this.comboList.length > 0) {
            results = await LookupType.find({ lookupType: { $in: this.comboList } });
        }

        for (let index = 0; index < this.comboList.length; index++) {
            const lookupType = this.comboList[index];
            if (!(results.findIndex(e => e.lookupType === lookupType) > -1)) {
                this.notFound.push(lookupType);
            }
        }

        for (let index = 0; index < results.length; index++) {
            const item = results[index];
            let comboData = await this.getComboData(item);
            this.comboData[item.lookupType] = comboData;
        }

        for (let index = 0; index < this.notFound.length; index++) {
            const item = this.notFound[index];
            this.comboData[item] = await this.customLookup(item, new CustomLookupInfo());
        }
        return this.comboData;
    }

    async customLookup(item, info) {
        if (Utility.isNullOrEmpty(info._field)) {
            return [];
        }
        let options = [];
        if (info.filter) {
            options.push({ "$match": info.filter })
        }
        if (info.field) {
            options.push({ "$project": info.field });
        }
        if (info.sort) {
            options.push({ "$sort": { [info.sort]: -1 } });
        }
        let model = mongoose.model(info.source);
        return await model.aggregate(options);
    }

    async getComboData(item) {
        const { project, sort } = this.customizeData(item, {
            sort: { sortOrder: -1 },
            project: {
                "_id": 0,
                "lookupId": "$_id",
                "displayValue": 1,
                "customValue": 1
            }
        });
        return await Lookup.aggregate([
            { $match: { lookupTypeId: item._id } },
            { $sort: sort },
            { $project: project }
        ]);
    }

    customizeData(item, data) {
        return data;
    }
}
module.exports = LookupListBase;