const JWTParser = require('./JWTParser');
const CustomLookupInfo = require('./CustomLookupInfo');
const LookupListBase = require('./LookupListBase');

class Helper {
    static get JWTParser() { return JWTParser; }
    static get CustomLookupInfo() { return CustomLookupInfo; }
    static get LookupListBase() { return LookupListBase; }
}
module.exports = Helper;