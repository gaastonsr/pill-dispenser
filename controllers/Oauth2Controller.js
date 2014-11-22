'use strict';

var Joi         = require('joi');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(sessionsModel) {
        this.sessionsModel = sessionsModel;
    },

    getToken: function(request, response, next) {
        var jsonResponse = {};
        var grantType    = request.query.grant_type;

        switch(grantType) {
            case 'client_credentials':
                this._clientCredentialsGrant(request, response, next);
                break;

            default:
                jsonResponse.error = {
                    code   : 400,
                    name   : 'GrantTypeNotAllowed',
                    message: 'Grant type not allowed'
                };

                response.status(jsonResponse.error.code).send(jsonResponse);
                break;
        }
    },

    _clientCredentialsGrant: function(request, response, next) {
        var jsonResponse = {};
        var data = {
            email   : request.body.email,
            password: request.body.password
        };
        var result = Joi.validate(data, {
            email   : validations.email.required(),
            password: validations.password.required()
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

        this.sessionsModel.createFromClientCredentials({
            email   : data.email,
            password: data.password
        })
        .then(function() {
            return response.status(201).send(jsonResponse);
        })
        .catch(function(error) {
            if (error.name === 'InvalidCredentials') {
                jsonResponse.error = {
                    code   : 401,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            if (error.name === 'InactiveUser') {
                jsonResponse.error = {
                    code   : 403,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).send(jsonResponse);
            }

            return next(error);
        });
    }
});

