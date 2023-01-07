const { Schema } = require('../lib/schema')

const account = new Schema('Account').addField('Name');

module.exports = account