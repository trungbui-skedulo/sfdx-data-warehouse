const Schema = function (sobjectName) {
    this.sobjectName = sobjectName
    this.fields = ['Id']

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

module.exports = { Schema }