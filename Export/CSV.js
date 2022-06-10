/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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