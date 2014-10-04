var path      = require('path');
var _         = require('underscore');
    _.str     = require('underscore.string');
var bookshelf = require(path(__dirname, '..', 'bookshelf'));

var UserORM = bookshelf.Model.extend({

    tableName    : 'users',
    hasTimestamps: ['createdAt', 'updatedAt'],

    format: function(attrs) {
        return _.reduce(attrs, function(memory, value, key) {
            memory[_.str.underscored(key)] = value;
            return memory;
        }, {});
    },

    parse: function(attrs) {
        return _.reduce(attrs, function(memory, value, key) {
            memory[_.str.camelize(key)] = value;
            return memory;
        }, {});
    }

});

module.exports = UserORM;
