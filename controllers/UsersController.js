'use strict';

var config      = require('config');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(mailer, usersModel) {
        this.mailer     = mailer;
        this.usersModel = usersModel;
    },

    create: function(request, response, next) {
        var self = this;
        var result = this.validate({
            name             : request.body.name,
            email            : request.body.email,
            emailConfirmation: request.body.emailConfirmation,
            password         : request.body.password
        }, {
            name             : validations.user.name.required(),
            email            : validations.email.required(),
            emailConfirmation: validations.matches('email').required(),
            password         : validations.password.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.usersModel.create({
            email   : result.value.email,
            password: result.value.password,
            name    : result.value.name
        })
        .then(function(user) {
            self.mailer.sendMail('account-activation', {
                emailConfirmationURL: config.get('websiteURL') + '/activar-cuenta/' + user.activationToken
            }, {
                to     : user.email,
                subject: 'Activación de Cuenta'
            });

            response.sendData(201, {
                kind     : 'UserProfile',
                id       : user.id,
                name     : user.name,
                email    : user.email,
                updatedAt: user.updatedAt.toISOString(),
                createdAt: user.createdAt.toISOString()
            });
        })
        .catch(function(error) {
            if (error.name === 'DuplicateEmail') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    activate: function(request, response, next) {
        this.usersModel.activate({
            activationToken: request.params.token
        })
        .then(function(user) {
            return response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'InvalidToken' || error.name === 'UserAlreadyActive') {
                return response.sendError(error);
            }

            next(error);
        });
    }

});
