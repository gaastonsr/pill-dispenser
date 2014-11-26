'use strict';

var Promise            = require('bluebird');
var bcrypt             = require('bcrypt');
var _                  = require('underscore');
    _.str              = require('underscore.string');
var bookshelf          = require('./../bookshelf');
var DeviceORM          = require('./../ORMs/DeviceORM');
var UserDeviceORM      = require('./../ORMs/UserDeviceORM');
var DeviceSettingORM   = require('./../ORMs/DeviceSettingORM');

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
            var linkage = model.toJSON();

            linkage.updatedAt = linkage.updated_at;
            linkage.createdAt = linkage.created_at;

            delete linkage.updated_at;
            delete linkage.created_at;

            return linkage;
        });
    },

    listLinkages: function(data) {
        return new UserDeviceORM({
            userId: data.userId
        })
        .query(function(queryBuilder) {
            queryBuilder.orderBy('id', 'asc');
        })
        .fetchAll()
        .then(function(collection) {
            return collection.toJSON();
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
            /* istanbul ignore if  */
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

    addSetting: function(data) {
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

            return new DeviceSettingORM({
                deviceId    : model.get('deviceId'),
                medicineName: data.medicineName,
                schedule    : JSON.stringify(data.schedule),
                status      : '0'
            })
            .save();
        })
        .then(function(model) {
            var setting       = model.toJSON();
            setting.schedule  = JSON.parse(setting.schedule);
            setting.updatedAt = setting.updated_at;
            setting.createdAt = setting.created_at;

            delete setting.updated_at;
            delete setting.created_at;

            return setting;
        });
    },

    listSettings: function(data) {
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

            return new DeviceSettingORM({
                deviceId: model.get('deviceId')
            })
            .query(function(queryBuilder) {
                queryBuilder.orderBy('id', 'asc');
            })
            .fetchAll();
        })
        .then(function(collection) {
            return collection.toJSON();
        });
    },

    activateSetting: function(data) {
        var error        = null;
        var deviceModel  = null;
        var settingModel = null;

        return bookshelf.transaction(function(trx) {
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

                deviceModel = model;

                return new DeviceSettingORM({
                    id: data.settingId
                })
                .fetch();
            })
            .then(function(model) {
                if (!model || model.get('deviceId') !== deviceModel.get('deviceId')) {
                    error      = new Error();
                    error.name = 'SettingNotFound';
                    return Promise.reject(error);
                }

                if (model.get('status') === '1') {
                    error      = new Error('Setting is already active');
                    error.name = 'SettingAlreadyActive';
                    return Promise.reject(error);
                }

                settingModel = model;

                return new DeviceSettingORM()
                .query()
                .transacting(trx)
                .where({
                    device_id: deviceModel.get('id'),
                    status   : '1'
                })
                .update({
                    status: '0'
                });
            })
            .then(function() {
                return settingModel.save({
                    status: '1'
                }, {
                    transacting: trx,
                    patch      : true
                });
            });
        })
        .then(function() {
            return;
        });
    },

    deactivateSetting: function(data) {
        var error       = null;
        var deviceModel = null;

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

            deviceModel = model;

            return new DeviceSettingORM({
                id: data.settingId
            })
            .fetch();
        })
        .then(function(model) {
            if (!model || model.get('deviceId') !== deviceModel.get('deviceId')) {
                error      = new Error();
                error.name = 'SettingNotFound';
                return Promise.reject(error);
            }

            if (model.get('status') === '0') {
                error      = new Error('Setting is already inactive');
                error.name = 'SettingAlreadyInactive';
                return Promise.reject(error);
            }

            return model.save({
                status: '0'
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return;
        });
    },

    deleteSetting: function(data) {
        var error       = null;
        var deviceModel = null;

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

            deviceModel = model;

            return new DeviceSettingORM({
                id: data.settingId
            })
            .fetch();
        })
        .then(function(model) {
            if (!model || model.get('deviceId') !== deviceModel.get('deviceId')) {
                error      = new Error();
                error.name = 'SettingNotFound';
                return Promise.reject(error);
            }

            if (model.get('status') === '1') {
                error = new Error('Active settings can\'t be deleted');
                error.name = 'DeleteActiveSetting';
                return Promise.reject(error);
            }

            return model.destroy();
        })
        .then(function() {
            return;
        });
    }
};

module.exports = MyDevicesModel;
