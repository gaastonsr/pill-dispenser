var _   = require('underscore');
var Joi = require('joi');

var Toolkit = {};

var energizer = Toolkit.energizer = function() {
    return function(request, response, next) {
        response.sendError = sendError;
        response.sendData  = sendData;
        next();
    };
};

var sendError = function(code, error) {
    if (typeof code !== 'number') {
        error = code;
        code  = 400;
    }

    var extra = {};

    Object.keys(error).forEach(function(key) {
        extra[key] = error[key];
    });

    this.status(code).send({
        error: _.extend({
            code   : code,
            name   : error.name,
            message: error.message
        }, extra)
    });
};

var sendData = function(code, data) {
    if (typeof code !== 'number') {
        data = code;
        code = 200;
    }

    this.status(code).send({
        data: data
    });
};

var Controller = Toolkit.Controller = function() {
    // fix route handlers context
    _.bindAll.apply(_, [this].concat(_.functions(this)));

    this.initialize.apply(this, arguments);
};

_.extend(Controller.prototype, {

    validate: function(data, schema) {
        var result = Joi.validate(data, schema, {
            abortEarly: false
        });

        var error = null;

        if (result.error) {
            error        = new Error('Validation error');
            error.name   = 'ValidationError';
            error.errors = [];

            result.error.details.forEach(function(detail) {
                error.errors.push({
                    location: detail.path,
                    message : detail.message
                });
            });
        }

        return {
            error: error,
            value: result.value
        };
    }

});

var extend = function(prototypeProperties, staticProperties) {
    var parent = this;
    var child;

    if (prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
        child = prototypeProperties.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    _.extend(child, parent, staticProperties);

    var Surrogate = function() {
        this.constructor = child;
    };

    Surrogate.prototype = parent.prototype;
    child.prototype     = new Surrogate();

    if (prototypeProperties) {
        _.extend(child.prototype, prototypeProperties);
    }

    child.__super__ = parent.prototype;

    return child;
};

Controller.extend = extend;

module.exports = Toolkit;
