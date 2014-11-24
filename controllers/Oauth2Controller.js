'use strict';

var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(sessionsModel) {
        this.sessionsModel = sessionsModel;
    },

    getToken: function(request, response, next) {
        var grantType = request.query.grant_type;

        switch(grantType) {
            case 'client_credentials':
                this._clientCredentialsGrant(request, response, next);
                break;

            default:
                var error  = new Error('Grant type not allowed');
                error.name = 'GrantTypeNotAllowed';
                response.sendError(error);
                break;
        }
    },

    _clientCredentialsGrant: function(request, response, next) {
        var result = this.validate({
            email   : request.body.email,
            password: request.body.password
        }, {
            email   : validations.email.required(),
            password: validations.password.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.sessionsModel.createFromClientCredentials({
            email   : result.value.email,
            password: result.value.password
        })
        .then(function() {
            return response.status(201).send({});
        })
        .catch(function(error) {
            if (error.name === 'InvalidCredentials') {
                return response.sendError(401, error);
            }

            if (error.name === 'InactiveUser') {
                return response.sendError(403, error);
            }

            next(error);
        });
    }
});

