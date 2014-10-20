'use strict';

var path      = require('path');
var knex      = require('knex');
var Bookshelf = require('bookshelf');
var knexfile  = require('./knexfile');

module.exports = new Bookshelf(knex(knexfile.anyEnv));
