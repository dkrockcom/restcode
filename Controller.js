/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Utility = require("./Utility");
const { Excel, CSV, PDF } = require('./Export');
const Logger = require('./Helper/Logger');
const ControllerBase = require('./ControllerBase');
const { controller, messages } = require('./constants');
const mongoose = require('mongoose');
const moment = require('moment');

const ignorePropertes = [
    "action", "populate"
];

class Controller extends ControllerBase {

    isHardDelete = false;
    fetchDeletedRecords = false;

    getProperties = (httpContext) => {
        let params = { ...httpContext.params };
        const isNew = Utility.isNullOrEmpty(httpContext.params._id);
        const props = this.model.schema.obj;

        if (props.hasOwnProperty(controller.defaultProperties.createdBy) && isNew) {
            params[controller.defaultProperties.createdBy] = httpContext.userId
        }

        if (props.hasOwnProperty(controller.defaultProperties.modifiedBy) && !isNew) {
            params[controller.defaultProperties.modifiedBy] = httpContext.userId
        }
        ignorePropertes.forEach(prop => {
            delete params["prop"];
        });
        return params;
    }

    async execute(http) {
        let response = {};
        const id = http.params._id || http.params.id;
        const populate = http.params.populate;
        try {
            switch (http.params.action.toUpperCase()) {
                case controller.action.SAVE:
                    await this.beforeSave(http);
                    response = await this.save(http);
                    await this.afterSave(http, response);
                    break;

                case controller.action.LOAD:
                    await this.beforeLoad(http);
                    response = await this.load(http, id, populate);
                    await this.afterLoad(http, response);
                    break;

                case controller.action.DELETE:
                    await this.beforeDelete(http, id);
                    response = await this.delete(id);
                    await this.afterDelete(http, id);
                    break;

                case controller.action.LIST:
                case controller.action.EXPORT:
                    response = await this.list(http);
                    //Export data
                    if (http.params.action.toUpperCase() === controller.action.EXPORT) {
                        response = await this.list(http, true);
                        let type = !Utility.isNullOrEmpty(http.params.type) ? http.params.type.toUpperCase() : controller.exportType.EXCEL;
                        this.dataExport(type, response.data.records, http);
                        return null;
                    }
                    break;

                default:
                    response = {
                        success: false,
                        message: messages.INVALID_ACTION
                    }
                    break;
            }
        } catch (ex) {
            response = {
                success: false,
                message: ex.message
            }
            Logger.error(ex);
        }
        return response;
    }

    dataExport(exportType, data, http) {
        switch (exportType) {
            case controller.exportType.EXCEL:
                Excel.Export({ filename: this.constructor.name, data: data, http });
                break;

            case controller.exportType.PDF:
                PDF.Export({ filename: this.constructor.name, data: data, http });
                break;

            case controller.exportType.CSV:
                CSV.Export({ filename: this.constructor.name, data: data, http });
                break;

            default:
                Excel.Export({ filename: this.constructor.name, data: data, http });
                break;
        }
    }

    //Action Handler
    async save(httpContext) {
        let response = { success: true, message: "", data: null };
        let props = this.getProperties(httpContext);
        await this.beforeSave(httpContext);
        //update
        if (httpContext.params._id) {
            response.data = await this.model.updateOne({ _id: httpContext.params._id }, props);
            response.message = 'Record sucessfully updated.';
        } else {
            response.data = await this.model.create(props);
            response.message = 'Record sucessfully created.';
        }
        await this.afterSave(httpContext, response.data);
        return response;
    }

    async load(httpContext, id, populate) {
        let response = { success: true, message: "", data: null };
        let comboData = await this.getCombos(httpContext);
        let record = null;
        if (httpContext.params.populate) {
            record = await this.model.findOne({ _id: id }).populate(populate);
        } else {
            record = await this.model.findOne({ _id: id });
        }
        response.message = record ? "Record Loaded" : "Record not exists";
        response.data = record;
        response.combo = comboData;
        return response;
    }

    async delete(ids) {
        if (this.isHardDelete) {
            await this.model.deleteMany({ _id: { $in: ids.split(",") } })
        } else {
            await this.model.updateMany({ _id: { $in: ids.split(",") } }, { isDeleted: true });
        }
        return {
            success: true,
            message: "Record deleted"
        }
    }

    async getFilter(filters = {}, httpContext) {
        return filters || null;
    }

    async getLookup(lookup, httpContext) {
        return lookup || null;
    }

    async getpProjection(projection, httpContext) {
        return projection || null;
    }

    createFilter(filters = {}) {
        const filter = {};
        for (const key in filters) {
            let item = filters[key];
            const type = this.model.schema.obj[item.field].type.name;
            switch (type) {
                case "Number":
                    filter[item.field] = Number(item.value);
                    break;

                case "Date":
                    const start = moment(item.value).startOf('day');
                    const end = moment(item.value).endOf('day');
                    filter[item.field] = {
                        $gte: start.toDate(),
                        $lt: end.toDate()
                    }
                    break;

                case "Boolean":
                    filter[item.field] = (JSON.parse(item.value) == 1 ? true : false || false)
                    break;

                case "ObjectId":
                    filter[item.field] = mongoose.Types.ObjectId(item.value)
                    break;

                default:
                    filter[item.field] = item.operator == 'StartsWith' ? { '$regex': item.value, '$options': 'i' } : item.value;
                    break;
            }
        }
        return filter;
    }

    async list(httpContext, isExport) {
        let params = httpContext.params;
        try {
            let comboData = await this.getCombos(httpContext);
            let aggregateOptions = [];

            //Filters/Match
            const filters = await this.getFilter(params.filters, httpContext);
            if (filters) {
                //Prepare filters and pass to aggregate
                let finalFilter = this.createFilter(filters);
                if (!this.fetchDeletedRecords) {
                    finalFilter = { ...finalFilter, isDeleted: false }
                }
                aggregateOptions.push({
                    "$match": finalFilter
                });
            }

            //Join/Lookup
            const lookup = await this.getLookup(params.lookup, httpContext);
            if (lookup) {
                aggregateOptions.push(lookup);
            }

            //Select/Projection
            const projection = await this.getpProjection(params.projection, httpContext);
            if (projection) {
                aggregateOptions.push(projection);
            }
            //Sorting
            if (params.sort && params.dir) {
                aggregateOptions.push({ "$sort": { [params.sort]: params.dir.toLowerCase() == 'desc' ? - 1 : 1 } });
            }

            if (isExport) {
                params.limit = 50000;
            }

            aggregateOptions.push({
                "$facet": {
                    records: [{ $skip: Number(params?.start || 0) }, { $limit: Number(params?.limit || 50) }],
                    recordCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            });

            let result = await this.model.aggregate(aggregateOptions);
            result = result[0];
            return {
                success: true,
                data: {
                    records: result.records,
                    combos: comboData,
                    recordCount: result.recordCount.length > 0 ? result.recordCount[0].count : 0
                }
            }
            // //Export data
            // if (this._action.toUpperCase() === controller.action.EXPORT) {
            //     let type = !Utility.isNullOrEmpty(this.httpHelper.Params.type) ? this.httpHelper.Params.type.toUpperCase() : controller.exportType.EXCEL;
            //     this.dataExport(type, records);
            // }
        } catch (ex) {
            return {
                success: false,
                messages: ex.message,
                data: {
                    records: [],
                    combos: [],
                    recordCount: 0
                }
            }
        }
    }
};

module.exports = Controller;