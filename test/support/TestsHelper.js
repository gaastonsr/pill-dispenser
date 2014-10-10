var path      = require('path');
var Promise   = require('bluebird');
var _         = require('underscore');
var bookshelf = require(path.join(__dirname, '..', '..', 'bookshelf'));

var knex = bookshelf.knex;

function TestsHelper() {

}

TestsHelper.prototype = {
    constructor: TestsHelper,

    // order is important to avoid foreign key constraints
    tables: [
        'usersDevices',
        'users',
        'devices'
    ],

    tearDown: function() {
        var truncates = [];

        for (var i = 0; i < this.tables.length; i++) {
            var table = this.tables[i];
            truncates.push(knex(table).delete());
        }

        return Promise.all(truncates);
    },

    setUp: function(data) {
        var tables  = _.keys(data);
        var inserts = [];

        return this.tearDown()
        .then(function() {
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                var rows  = data[table];
                inserts.push(knex(table).insert(rows));
            }

            return Promise.all(inserts);
        });
    }
};

module.exports = TestsHelper;
