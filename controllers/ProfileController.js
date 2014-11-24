'use strict';

var Joi         = require('joi');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(usersModel) {
        this.usersModel = usersModel;
    },

    get: function(request, response, next) {
        this.usersModel.getById({
            id: request.user.id
        })
        .then(function(user) {
            response.sendData({
                kind     : 'UserProfile',
                id       : user.id,
                name     : user.name,
                email    : user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            });
        })
        .catch(next);
    },

    update: function(request, response, next) {
        var result = this.validate({
            name: request.body.name
        }, {
            name: validations.user.name.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.usersModel.update({
            userId: request.user.id,
            name  : result.value.name
        })
        .then(function() {
            response.status(200).send({});
        })
        .error(next);
    },

    updatePassword: function(request, response, next) {
        var jsonResponse = {};
        var data = {
            id: request.body.id
        };
        var result = Joi.validate(data, {
            id: validations.id.required()
        });

        if (result.error) {
            var formattedError = validations.formatError(result.error);
            jsonResponse.error = {
                code   : 400,
                name   : formattedError.name,
                message: formattedError.message,
                errors : formattedError.errors
            };

            return response.status(jsonResponse.error.code).send(jsonResponse);
        }

        this.usersModel.func({
            id: data.id
        })
        .then(function(some) {
            jsonResponse.data = {
                kind: 'Some',
                id: some.id
            };

            response.status(200).send(jsonResponse);
        })
        .error(function(error) {
            if (error.name === 'SomeError') {
                jsonResponse.error = {
                    code   : 400,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            next();
        });
    },

    requestEmailUpdate: function(request, response, next) {
        var jsonResponse = {};
        var data = {
            id: request.body.id
        };
        var result = Joi.validate(data, {
            id: validations.id.required()
        });

        if (result.error) {
            var formattedError = validations.formatError(result.error);
            jsonResponse.error = {
                code   : 400,
                name   : formattedError.name,
                message: formattedError.message,
                errors : formattedError.errors
            };

            return response.status(jsonResponse.error.code).send(jsonResponse);
        }

        this.usersModel.func({
            id: data.id
        })
        .then(function(some) {
            jsonResponse.data = {
                kind: 'Some',
                id: some.id
            };

            response.status(200).send(jsonResponse);
        })
        .error(function(error) {
            if (error.name === 'SomeError') {
                jsonResponse.error = {
                    code   : 400,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            next();
        });
    },

    updateEmail: function(request, response, next) {
        var jsonResponse = {};
        var data = {
            id: request.body.id
        };
        var result = Joi.validate(data, {
            id: validations.id.required()
        });

        if (result.error) {
            var formattedError = validations.formatError(result.error);
            jsonResponse.error = {
                code   : 400,
                name   : formattedError.name,
                message: formattedError.message,
                errors : formattedError.errors
            };

            return response.status(jsonResponse.error.code).send(jsonResponse);
        }

        this.usersModel.func({
            id: data.id
        })
        .then(function(some) {
            jsonResponse.data = {
                kind: 'Some',
                id: some.id
            };

            response.status(200).send(jsonResponse);
        })
        .error(function(error) {
            if (error.name === 'SomeError') {
                jsonResponse.error = {
                    code   : 400,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            next();
        });
    }

});
