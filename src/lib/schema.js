const Schema = function (sobjectName) {
    this.sobjectName = sobjectName
    this.fields = ['Id']
    this.referenceField2SobjectMap = {}
}

Schema.prototype.getQuery = function () {
    let query = 'select '
    query = query + this.fields.join(',')
    query = query + ` from ${this.sobjectName}`
    return query;
}

Schema.prototype.addField = function (field) {
    this.fields.push(field)

    return this
}

Schema.prototype.addReferenceField = function (field, sobjectName) {
    this.fields.push(field)
    this.referenceField2SobjectMap[field] = sobjectName

    return this
}

module.exports = { Schema }