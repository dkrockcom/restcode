class CustomLookupInfo {
    constructor() {
        this._field = '';
        this._source = '';
        this._filter = [];
        this._sort = null;
    }

    set field(val) { this._field = val; }
    set source(val) { this._source = val; }
    set filter(val) { this._filter = val; }
    set sort(val) { this._sort = val; }

    get field() { return this._field; }
    get source() { return this._source; }
    get filter() { return this._filter; }
    get sort() { return this._sort; }
}
module.exports = CustomLookupInfo;