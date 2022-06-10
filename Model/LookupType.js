const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    lookupType: { type: String },
    scopeId: { type: Number }
}, { timestamps: true });

const model = mongoose.model('LookupType', schema, 'LookupType');
module.exports = model;