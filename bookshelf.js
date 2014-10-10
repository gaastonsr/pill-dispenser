var path      = require('path');
var knex      = require('knex');
var Bookshelf = require('bookshelf');
var config    = require(path.join(__dirname, 'config'));

module.exports = Bookshelf(knex({
    client    : 'pg',
    connection: config.database
}));
