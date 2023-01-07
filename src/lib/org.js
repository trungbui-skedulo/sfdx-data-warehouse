const jsforce = require('jsforce');
const Org = jsforce.Connection;

Org.prototype.connect = function ({ username, passworld }) {
    return new Promise((res, rej) => {
        this.login(username, passworld, function (err, userInfo) {
            if (err) rej(err);

            res(userInfo);
        });
    })
}

Org.prototype.fetchRecords = function (schema) {
    return new Promise((res, rej) => {
        const soql = schema.getQuery();
        const records = []
        this.query(soql)
            .on("record", function (record) {
                delete record.attributes;
                records.push(record);
            })
            .on("end", function () {
                res(records)
            })
            .on("error", function (err) {
                rej(err)
            })
            .run({ autoFetch: true, maxFetch: 5000 });
    })
}

module.exports = { Org }