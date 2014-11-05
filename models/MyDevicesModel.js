'use strict';

var Promise       = require('bluebird');
var bcrypt        = require('bcrypt');
var DeviceORM     = require('./../ORMs/DeviceORM');
var UserDeviceORM = require('./../ORMs/UserDeviceORM');

bcrypt = Promise.promisifyAll(bcrypt);

function MyDevicesModel() {

}

MyDevicesModel.prototype = {
    constructor: MyDevicesModel,

    link: function(data) {
        var error       = null;
        var deviceModel = null;

        return new DeviceORM({
            identifier: data.identifier
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                error      = new Error('Identifier and/or password are incorrect');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            deviceModel = model;

            return bcrypt.compareAsync(data.password, model.get('password'));
        })
        .then(function(areSame) {
            if (!areSame) {
                error      = new Error('Identifier and/or password are incorrect');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            return new UserDeviceORM({
                deviceId: deviceModel.get('id'),
                userId  : data.userId
            })
            .fetch();
        })
        .then(function(model) {
            if (model) {
                error      = new Error('Device already linked');
                error.name = 'AlreadyLinked';
                return Promise.reject(error);
            }

            return new UserDeviceORM({
                userId  : data.userId,
                name    : data.name,
                deviceId: deviceModel.get('id')
            })
            .save();
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    unlink: function(data) {
        var error = null;

        return new UserDeviceORM({
            id: data.linkageId
        })
        .fetch()
        .then(function(model) {
            if (!model || (model.get('userId') !== data.userId)) {
                error      = new Error('Linkage not found');
                error.name = 'LinkageNotFound';
                return Promise.reject(error);
            }

            return model.destroy();
        })
        .then(function(model) {
            return;
        });
    },

    updatePassword: function(data) {
        var error           = null;
        var userDeviceModel = null;
        var deviceModel     = null;

        return new UserDeviceORM({
            id: data.linkageId
        })
        .fetch()
        .then(function(model) {
            if (!model || (model.get('userId') !== data.userId)) {
                error      = new Error('Linkage not found');
                error.name = 'LinkageNotFound';
                return Promise.reject(error);
            }

            userDeviceModel = model;

            return new DeviceORM({
                id: model.get('deviceId')
            })
            .fetch();
        })
        .then(function(model) {
            if (!model) { // should never happen, double check
                error      = new Error('DeviceNotFound');
                error.name = 'DeviceNotFound';
                return Promise.reject(error);
            }

            deviceModel = model;

            return bcrypt.compareAsync(data.currentPassword, model.get('password'));
        })
        .then(function(areSame) {
            if (!areSame) {
                error      = new Error('Password is incorrect');
                error.name = 'IncorrectPassword';
                return Promise.reject(error);
            }

            return bcrypt.hashAsync(data.newPassword, 10);
        })
        .then(function(hash) {
            return deviceModel.save({
                password: hash
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return;
        });
    },

    updateName: function(data) {
        var error = null;

        return new UserDeviceORM({
            id: data.linkageId
        })
        .fetch()
        .then(function(model) {
            if (!model || (model.get('userId') !== data.userId)) {
                error      = new Error('Linkage not found');
                error.name = 'LinkageNotFound';
                return Promise.reject(error);
            }

            return model.save({
                name: data.name
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    addSettings: function() {

    },

    deleteSettings: function() {

    },

    updateActiveSettings: function() {

    },

    deactivate: function() {

    },

    activate: function() {

    }
};

module.exports = MyDevicesModel;
