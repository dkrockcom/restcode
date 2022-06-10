/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    //Email Required fields
    to: { type: String },
    from: { type: String },
    subject: { type: String },
    body: { type: String },

    //Optional fields
    cc: { type: String },
    bcc: { type: String },

    //Management fields
    type: { type: Number, default: 0 }, //Email/Text
    isHtml: { type: Boolean, default: true },
    sentOn: { type: Date },
    isSent: { type: Boolean, default: false },
    retryCount: { type: Number, default: 0 },
    attachments: []
}, { timestamps: true });

const PeopleCountModal = mongoose.model('NotificationQueue', schema, 'NotificationQueue');
module.exports = PeopleCountModal;