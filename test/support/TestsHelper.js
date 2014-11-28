'use strict';

var Promise    = require('bluebird');
var bookshelf  = require('./../../bookshelf');
var _          = require('underscore');
var sinon      = require('sinon');

var knex = bookshelf.knex;

function TestsHelper() {
}

TestsHelper.prototype = {
    constructor: TestsHelper,

    deletionOrder: [
        'devices_settings',
        'users_devices',
        'sessions',
        'users',
        'devices'
    ],

    insertionOrder: [
        'users',
        'sessions',
        'devices',
        'users_devices',
        'devices_settings'
    ],

    tearDown: function() {
        return Promise.resolve(this.deletionOrder)
        .each(function(item, index, value) {
            return knex(item).delete();
        });
    },

    setUp: function(data) {
        var self = this;

        return this.tearDown()
        .then(function() {
            return Promise.resolve(self.insertionOrder)
            .each(function(item, index, value) {
                var rows = data[item];

                if (!rows) {
                    return;
                }

                return knex(item).insert(rows);
            });
        });
    }
};

TestsHelper.replaceParams = function(path, params) {
    var keys = Object.keys(params);

    keys.forEach(function(key) {
        var value = params[key];
        var param = ':' + key;
        path = path.replace(param, value);
    });

    return path;
};

module.exports = TestsHelper;
