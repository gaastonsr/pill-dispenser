'use strict';

var express      = require('express');
var bodyParser   = require('body-parser');
var config       = require('config');
var routes       = require('./routes');
var toolkit      = require('./libs/api-toolkit');
var error404     = require('./middlewares/error404');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.set('env',  config.get('nodeEnv'));
app.set('port', config.get('port'));

app.use(bodyParser.json());
app.use(toolkit.energizer());
app.use(routes);
app.use(error404);
app.use(errorHandler);

module.exports = app;
