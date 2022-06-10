/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true },
    password: { type: String },
    displayPicture: { type: String },
    email: { type: String, unique: true },
    role: { type: Number, default: 2 },//2 = user
    isActive: { type: Boolean, default: false },
    passKey: { type: String },
    passwordResetRequestOn: { type: Date }
}, { timestamps: true });

const model = mongoose.model('User', schema, 'User');
module.exports = model;