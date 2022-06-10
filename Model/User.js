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