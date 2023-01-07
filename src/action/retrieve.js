const fs = require('fs/promises');
const { Org } = require('../lib/org')
const schema = require('../schema')

const retrieve = async function () {
    const org = new Org({
        loginUrl: 'https://test.salesforce.com'
    })

    await org.connect({
        username: 'expertservices@skedulo.com.ac.awahcp',
        passworld: 'c6Gu4.dWYEDcN6jj44'
    })

    Object.values(schema).forEach(schema => {
        console.log(`Fetch :===> ${schema.sobjectName}`);
        org.fetchRecords(schema).then((records) => {
            fs.writeFile(`data/retrieved/${schema.sobjectName}.json`, JSON.stringify(records))
            console.log(`Store :===> ${schema.sobjectName}`);
        })
    });
}

module.exports = retrieve