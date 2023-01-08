const jsforce = require("jsforce");
const Org = jsforce.Connection;

Org.prototype.connect = function ({ username, password }) {
    return new Promise((res, rej) => {
        this.login(username, password, function (err, userInfo) {
            if (err) {
                rej(err);
                return;
            }

            res(userInfo);
        });
    });
};

Org.prototype.fetchRecords = function (schema) {
    return new Promise((res, rej) => {
        const soql = schema.getQuery();
        const records = [];
        this.query(soql)
            .on("record", function (record) {
                delete record.attributes;
                records.push(record);
            })
            .on("end", function () {
                res(records);
            })
            .on("error", function (err) {
                rej(err);
            })
            .run({ autoFetch: true, maxFetch: 50000 });
    });
};

Org.prototype.createRecords = function (objectName, records) {
    return new Promise((res, rej) => {
        this.sobject(objectName).create(
            records,
            { allowRecursive: true },
            function (err, rets) {
                if (err) {
                    rej(err);
                    return;
                }

                res(rets);
            }
        );
    });
};

module.exports = { Org };
