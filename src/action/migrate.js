const fs = require('fs/promises');
const { Org } = require('../lib/org')
const schemas = require('../schema')
const config = require('../lib/config');
const { sobjectName } = require('../schema/account');

const migrate = async function () {
    let toMigrateQueue = {}
    let dependentQueue = {}
    const org = new Org({
        loginUrl: config.loginUrl
    })

    await Promise.all(Object.values(schemas).map(schema => {
        return fs.readFile(`data/retrieved/${schema.sobjectName}.json`, 'utf8').then(rawRecords => {
            const records = JSON.parse(rawRecords)
            dependentQueue[schema.sobjectName] = records
        })
    }));
    const oldId2NewIdMap = await collectIdMap()

    do {
        let queue = await queueRecords(oldId2NewIdMap, dependentQueue);
        toMigrateQueue = queue.toMigrateQueue
        dependentQueue = queue.dependentQueue
        await collectNewId(oldId2NewIdMap, toMigrateQueue)
        await storeIdMap(oldId2NewIdMap);
        console.log('queue.dependentQueue: ', queue.dependentQueue['Contact'].length);
    } while (!checkQueueEmpty(toMigrateQueue))

    // await org.connect({
    //     username: config.username,
    //     passworld: config.password
    // })


}

const checkQueueEmpty = function (queue) {
    let empty = true;

    Object.keys(queue).forEach(sobjectName => {
        if (queue[sobjectName].length > 0) empty = false;
    })

    return empty
}

const collectNewId = function (idMap, toMigrateQueue) {
    return Promise.all(Object.values(schemas).map(schema => {
        const records = toMigrateQueue[schema.sobjectName]
        return insertRecords(records, schema.sobjectName).then(oldId2NewIdMap => {
            idMap[schema.sobjectName] = { ...idMap[schema.sobjectName], ...oldId2NewIdMap }
        })
    }));
}

const insertRecords = async function (records, sobjectName) {
    const oldId2NewIdMap = {};

    records.forEach(record => {
        oldId2NewIdMap[record.Id] = `${sobjectName} - ${record.Id}`
    })

    return oldId2NewIdMap
}

const queueRecords = async function (idMap, recordQueue) {
    const toMigrateQueue = {}
    const dependentQueue = {}

    Object.values(schemas).forEach(schema => {
        const records = recordQueue[schema.sobjectName]
        toMigrateQueue[schema.sobjectName] = []
        dependentQueue[schema.sobjectName] = []

        records.forEach(record => {
            if (checkDependentRecord(record, schema, idMap)) {
                dependentQueue[schema.sobjectName].push(record);
            } else {
                toMigrateQueue[schema.sobjectName].push(record);
            }
        })
    });

    return { toMigrateQueue, dependentQueue }
}

const checkDependentRecord = function (record, schema, idMap) {
    let ifDependentRecord = false;

    Object.keys(schema.referenceField2SobjectMap).forEach((field) => {
        const referenceObject = schema.referenceField2SobjectMap[field]
        if (record[field] != null && !idMap[referenceObject][record[field]]) {
            ifDependentRecord = true;
        }
    })

    return ifDependentRecord;
}

const collectIdMap = async function () {
    const oldId2NewIdMap = {}
    const collectors = []

    Object.values(schemas).forEach(schema => {
        oldId2NewIdMap[schema.sobjectName] = {}
        const collector = fs.readFile(`data/retrieved/${schema.sobjectName}.json`, 'utf8').then(rawRecords => {
            const records = JSON.parse(rawRecords)
            records.forEach(record => {
                oldId2NewIdMap[schema.sobjectName][record.Id] = ''
            })
        })
        collectors.push(collector);
    });

    await Promise.all(collectors);

    return oldId2NewIdMap;
}

const storeIdMap = function (idMap) {
    Object.keys(idMap).forEach(sobjectName => {
        fs.writeFile(`data/migrated/${sobjectName}.json`, JSON.stringify(idMap[sobjectName]));
    });
}



module.exports = migrate