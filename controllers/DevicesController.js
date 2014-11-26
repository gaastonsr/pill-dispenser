'use strict';

var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(devicesModel) {
        this.devicesModel = devicesModel;
    },

    register: function(request, response, next) {
        var result = this.validate({
            identifier          : request.body.identifier,
            password            : request.body.password,
            passwordConfirmation: request.body.passwordConfirmation
        }, {
            identifier          : validations.device.identifier.required(),
            password            : validations.password.required(),
            passwordConfirmation: validations.matches('password').required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.devicesModel.create({
            identifier: result.value.identifier,
            password  : result.value.password
        })
        .then(function(device) {
            response.sendData(201, {
                kind      : 'DeviceProfile',
                id        : device.id,
                identifier: device.identifier,
                updatedAt : device.updatedAt,
                createdAt : device.createdAt
            });
        })
        .catch(function(error) {
            if (error.name === 'DuplicateIdentifier') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    delete: function(request, response, next) {
        var result = this.validate({
            deviceId: request.params.deviceId
        }, {
            deviceId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.devicesModel.delete({
            deviceId: result.value.deviceId
        })
        .then(function() {
            response.status(200).send();
        })
        .catch(function(error) {
            if (error.name === 'DeviceNotFound') {
                return response.sendError(404, error);
            }

            next(error);
        });
    }

});
