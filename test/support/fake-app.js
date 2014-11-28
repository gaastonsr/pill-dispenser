var express    = require('express');
var bodyParser = require('body-parser');
var toolkit    = require('./../../libs/api-toolkit');

module.exports = function(controller, routes) {
    var app     = express();
    var router  = express.Router();
    var methods = Object.keys(routes);

    methods.forEach(function(method) {
        var route = routes[method];

        if (route.middleware) {
            router[route.verb](route.path, route.middleware, controller[method]);
        } else {
            router[route.verb](route.path, controller[method]);
        }
    });

    // session stub
    app.use(function(request, response, next) {
        request.user = { id: 1 };
        next();
    });

    app.use(bodyParser.json());
    app.use(toolkit.energizer());
    app.use(router);

    app.use(function(error, request, response, next) {
        if (error.name !== 'UnknownError') {
            console.log(error);
            console.log(error.stack);
        }

        response.status(500).send();
    });

    return app;
};
