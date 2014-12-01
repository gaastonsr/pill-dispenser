'use strict';

var config      = require('config');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(mailer, usersModel) {
        this.mailer     = mailer;
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
        .catch(next);
    },

    updatePassword: function(request, response, next) {
        var result = this.validate({
            currentPassword        : request.body.currentPassword,
            newPassword            : request.body.newPassword,
            newPasswordConfirmation: request.body.newPasswordConfirmation
        }, {
            currentPassword        : validations.password.required(),
            newPassword            : validations.password.required(),
            newPasswordConfirmation: validations.matches('newPassword').required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.usersModel.updatePassword({
            userId         : request.user.id,
            currentPassword: result.value.currentPassword,
            newPassword    : result.value.newPassword
        })
        .then(function() {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'IncorrectPassword') {
                return response.sendError(401, error);
            }

            next(error);
        });
    },

    requestEmailUpdate: function(request, response, next) {
        var self = this;
        var result = this.validate({
            password            : request.body.password,
            newEmail            : request.body.newEmail,
            newEmailConfirmation: request.body.newEmailConfirmation
        }, {
            password            : validations.password.required(),
            newEmail            : validations.email.required(),
            newEmailConfirmation: validations.matches('newEmail').required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.usersModel.requestEmailUpdate({
            userId  : request.user.id,
            newEmail: result.value.newEmail,
            password: result.value.password
        })
        .then(function(user) {
            self.mailer.sendMail('email-update-request', {
                emailConfirmationURL: config.get('websiteURL') + '/confirmar-correo/' + user.emailUpdateToken
            }, {
                to     : user.email,
                subject: 'Confirmación de Dirección de Correo'
            });

            response.status(201).send({});
        })
        .catch(function(error) {
            if (error.name === 'IncorrectPassword') {
                return response.sendError(401, error);
            }

            if (error.name === 'DuplicateEmail' || error.name === 'DuplicateRequest') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    updateEmail: function(request, response, next) {
        this.usersModel.updateEmail({
            emailUpdateToken: request.params.token
        })
        .then(function() {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'InvalidToken') {
                return response.sendError(error);
            }

            if (error.name === 'ExpiredEmailUpdateRequest') {
                return response.sendError(410, error);
            }

            next(error);
        });
    }

});
