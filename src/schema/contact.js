const { Schema } = require('../lib/schema')

const contact = new Schema('Contact')
    .addField('Name')
    .addField('MobilePhone')
    .addField('Email');

module.exports = contact;