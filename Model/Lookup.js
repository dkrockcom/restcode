const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    lookupTypeId: { type: mongoose.Types.ObjectId, ref: 'LookupType' },
    displayValue: { type: String },
    scopeId: { type: String },
    customValue: { type: String },
    sortOrder: { type: Number }
}, { timestamps: true });

const model = mongoose.model('Lookup', schema, 'Lookup');
module.exports = model;