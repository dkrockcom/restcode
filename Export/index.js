const Excel = require('./Excel');
const CSV = require('./CSV');
const PDF = require('./PDF');

class Export {
    static get Excel() { return Excel; }
    static get CSV() { return CSV; }
    static get PDF() { return PDF; }
}
module.exports = Export;