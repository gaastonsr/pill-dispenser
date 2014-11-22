'use strict';

var Joi         = require('joi');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(usersModel) {
        this.usersModel = usersModel;
    },

    create: function(request, response, next) {
        var jsonResponse = {};
        var data = {
            name             : request.body.name,
            email            : request.body.email,
            emailConfirmation: request.body.emailConfirmation,
            password         : request.body.password
        };
        var result = Joi.validate(data, {
            name             : validations.user.name.required(),
            email            : validations.email.required(),
            emailConfirmation: validations.emailConfirmation.required(),
            password         : validations.password.required()
        }, {
            abortEarly: false
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

        this.usersModel.create({
            email   : data.email,
            password: data.password,
            name    : data.name
        })
        .then(function(user) {
            jsonResponse.data = {
                kind     : 'UserProfile',
                id       : user.id,
                name     : user.name,
                email    : user.email,
                updatedAt: user.updatedAt.toISOString(),
                createdAt: user.createdAt.toISOString()
            };

            return response.status(201).send(jsonResponse);
        })
        .catch(function(error) {
            if (error.name === 'DuplicateEmail') {
                jsonResponse.error = {
                    code   : 409,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            next(error);
        });
    },

    activate: function(request, response, next) {
        var jsonResponse = {};

        this.usersModel.activate({
            activationToken: request.params.token
        })
        .then(function(user) {
            return response.status(200).send(jsonResponse);
        })
        .catch(function(error) {
            if (error.name === 'InvalidToken' || error.name === 'UserAlreadyActive') {
                jsonResponse.error = {
                    code   : 400,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            return next(error);
        });
    }

});
