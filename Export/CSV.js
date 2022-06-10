const converter = require('json-2-csv');

class CSV {
    static async Export({ filename, data, config, http }) {
        http.response.setHeader('Content-Type', 'application/csv');
        http.response.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
        let binaryData = await this.Binary(data, config);
        http.response.end(binaryData, 'binary');
    }

    static async Binary(data, config) {
        let csvData = await converter.json2csvAsync(data, config);
        return csvData;
    }
}
module.exports = CSV;