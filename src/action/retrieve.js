const fs = require("fs/promises");
const { Org } = require("../lib/org");
const schema = require("../schema");
const config = require("../lib/config");

const retrieve = async function () {
    const org = new Org({
        loginUrl: config.loginUrl,
    });

    await org.connect({
        username: config.username,
        password: config.password,
    });

    Object.values(schema).forEach((schema) => {
        console.log(`Fetch :===> ${schema.sobjectName}`);
        org.fetchRecords(schema).then((records) => {
            fs.writeFile(
                `data/retrieved/${schema.sobjectName}.json`,
                JSON.stringify(records)
            );
            console.log(`Store :===> ${records.length} ${schema.sobjectName}`);
        });
    });
};

module.exports = retrieve;
