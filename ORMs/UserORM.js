var path      = require('path');
var bookshelf = require(path.join(__dirname, '..', 'bookshelf'));

var UserORM = bookshelf.Model.extend({

    tableName    : 'users',
    hasTimestamps: ['createdAt', 'updatedAt']

});

module.exports = UserORM;
