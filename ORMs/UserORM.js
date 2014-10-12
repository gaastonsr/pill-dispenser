var _         = require('underscore');
    _.str     = require('underscore.string');
var bookshelf = require('./../bookshelf');

var UserORM = bookshelf.Model.extend({

    tableName    : 'users',
    hasTimestamps: ['created_at', 'updated_at'],

    format: function(attributes) {
        return _.reduce(attributes, function(memory, value, key) {
            memory[_.str.underscored(key)] = value;
            return memory;
        }, {});
    },

    parse: function(attributes) {
        return _.reduce(attributes, function(memory, value, key) {
            memory[_.str.camelize(key)] = value;
            return memory;
        }, {});
    }

});

module.exports = UserORM;
