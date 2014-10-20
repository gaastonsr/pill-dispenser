'use strict';

var express      = require('express');
var bodyParser   = require('body-parser');
var config       = require('./config');
var routes       = require('./routes');
var error404     = require('./middlewares/error404');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.set('env',  config.nodeEnv);
app.set('port', config.port);

app.use(bodyParser.json());
app.use(routes);
app.use(error404);
app.use(errorHandler);

module.exports = app;
