var path         = require('path');
var express      = require('express');
var bodyParser   = require('body-parser');
var config       = require(path.join(__dirname, 'config'));
var routes       = require(path.join(__dirname, 'routes'));
var error404     = require(path.join(__dirname, 'middlewares', 'error404'));
var errorHandler = require(path.join(__dirname, 'middlewares', 'errorHandler'));

var app = express();

app.set('env',  config.nodeEnv);
app.set('port', config.port);

app.use(bodyParser.json());
app.use(routes);
app.use(error404);
app.use(errorHandler);

module.exports = app;
