const CustomLookupInfo = require('./CustomLookupInfo');
const Utility = require('../Utility');
const Lookup = require('../Model/Lookup');
const LookupType = require('../Model/LookupType');
const mongoose = require('mongoose');

class LookupListBase {
    constructor() {
        this.comboList = [];
        this.comboData = {};
        this.notFound = [];
    }

    async LoadCombo() {
        let results = [];
        if (this.comboList.length > 0) {
            results = await LookupType.find({ LookupType: { $in: this.comboList } });
        }

        for (let index = 0; index < this.comboList.length; index++) {
            const lookupType = this.comboList[index];
            if (!(results.findIndex(e => e.LookupType === lookupType) > -1)) {
                this.notFound.push(lookupType);
            }
        }

        for (let index = 0; index < results.length; index++) {
            const item = results[index];
            let comboData = await this.getComboData(item);
            this.comboData[item.LookupType] = comboData;
        }

        for (let index = 0; index < this.notFound.length; index++) {
            const item = this.notFound[index];
            this.comboData[item] = await this.CustomLookup(item, new CustomLookupInfo());;
        }
        return this.comboData;
    }

    async CustomLookup(item, info) {
        if (Utility.isNullOrEmpty(info._field)) {
            return [];
        }
        let options = [];
        if (info.filter) {
            options.push({ "$match": info.filter })
        }
        options.push({ "$project": info.field });
        options.push({ "$sort": { [info.sort]: -1 } });
        let model = mongoose.model(info.source);
        return await model.aggregate(options);
    }

    async getComboData(item) {
        return await Lookup.aggregate([
            { $match: { LookupTypeId: item._id } },
            { $sort: { SortOrder: -1 } },
            {
                "$project": {
                    "_id": 0,
                    "LookupId": "$_id",
                    "DisplayValue": 1,
                    "CustomValue": 1
                }
            }
        ]);
    }
}
module.exports = LookupListBase;