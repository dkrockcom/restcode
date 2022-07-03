/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    lookupTypeId: { type: mongoose.Types.ObjectId, ref: 'LookupType' },
    displayValue: { type: String },
    sortOrder: { type: Number }
}, { timestamps: true });

const model = mongoose.model('Lookup', schema, 'Lookup');
module.exports = model;