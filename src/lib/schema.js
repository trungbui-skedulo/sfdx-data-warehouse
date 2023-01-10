const Schema = function (sobjectName) {
    this.sobjectName = sobjectName;
    this.fields = ["Id"];
    this.referenceField2SobjectMap = {};
    this.condition = "";
};

Schema.prototype.getQuery = function () {
    let query = "SELECT ";
    query = query + this.fields.join(",");
    query = query + ` FROM ${this.sobjectName}`;
    query = query + condition;
    return query;
};

Schema.prototype.addField = function (field) {
    this.fields.push(field);

    return this;
};

Schema.prototype.addReferenceField = function (field, sobjectName) {
    this.fields.push(field);
    this.referenceField2SobjectMap[field] = sobjectName;

    return this;
};

Schema.prototype.where = function (condition) {
    this.condition = ` WHERE ${condition}`;

    return this;
};

Schema.prototype.and = function (condition) {
    this.condition += ` AND ${condition}`;

    return this;
};

module.exports = { Schema };
