'use strict';

var Promise   = require('bluebird');
var bcrypt    = require('bcrypt');
var DeviceORM = require('./../ORMs/DeviceORM');

bcrypt = Promise.promisifyAll(bcrypt);

function DevicesModel() {

}

DevicesModel.prototype = {
    constructor: DevicesModel,

    create: function(data) {
        var error = null;

        return new DeviceORM({
            identifier: data.identifier
        })
        .fetch()
        .then(function(model) {
            if (model) {
                error      = new Error('A device with that identifier already exists');
                error.name = 'DuplicateIdentifier';
                return Promise.reject(error);
            }

            return bcrypt.hashAsync(data.password, 10);
        })
        .then(function(hash) {
            return new DeviceORM({
                identifier: data.identifier,
                password  : hash
            })
            .save();
        })
        .then(function(model) {
            var device = model.toJSON();

            device.updatedAt = device.updated_at;
            device.createdAt = device.created_at;

            delete device.updated_at;
            delete device.created_at;
            delete device.password;

            return device;
        });
    },

    delete: function(data) {
        var error = null;

        return new DeviceORM({
            id: data.deviceId
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                error      = new Error('Device not found');
                error.name = 'DeviceNotFound';
                return Promise.reject(error);
            }

            return model.destroy();
        })
        .then(function(model) {
            return;
        });
    }
};

module.exports = DevicesModel;
