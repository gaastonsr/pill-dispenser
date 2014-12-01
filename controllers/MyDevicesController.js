'use strict';

var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(myDevicesModel) {
        this.myDevicesModel = myDevicesModel;
    },

    link: function(request, response, next) {
        var result = this.validate({
            name      : request.body.name,
            identifier: request.body.identifier,
            password  : request.body.password
        }, {
            name      : validations.device.name.required(),
            identifier: validations.device.identifier.required(),
            password  : validations.password.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.link({
            userId    : request.user.id,
            name      : result.value.name,
            identifier: result.value.identifier,
            password  : result.value.password
        })
        .then(function(linkage) {
            response.sendData(201, {
                kind     : 'DeviceLinkage',
                id       : linkage.id,
                name     : linkage.name,
                updatedAt: linkage.updatedAt,
                createdAt: linkage.createdAt
            });
        })
        .catch(function(error) {
            if (error.name === 'InvalidCredentials') {
                return response.sendError(401, error);
            }

            if (error.name === 'AlreadyLinked') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    list: function(request, response, next) {
        this.myDevicesModel.listLinkages({
            userId: request.user.id
        })
        .then(function(linkages) {
            var formattedLinkages = linkages.map(function(linkage) {
                return {
                    id       : linkage.id,
                    name     : linkage.name,
                    updatedAt: linkage.updatedAt.toISOString(),
                    createdAt: linkage.createdAt.toISOString()
                };
            });

            response.sendData({
                kind    : 'LinkagesList',
                linkages: formattedLinkages
            });
        })
        .catch(next);
    },

    unlink: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId
        }, {
            linkageId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.unlink({
            userId   : request.user.id,
            linkageId: result.value.linkageId
        })
        .then(function(linkage) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound') {
                return response.sendError(404, error);
            }

            next(error);
        });
    },

    updatePassword: function(request, response, next) {
        var result = this.validate({
            linkageId              : request.params.linkageId,
            currentPassword        : request.body.currentPassword,
            newPassword            : request.body.newPassword,
            newPasswordConfirmation: request.body.newPasswordConfirmation
        }, {
            linkageId              : validations.id.required().options({ convert: true }),
            currentPassword        : validations.password.required(),
            newPassword            : validations.password.required(),
            newPasswordConfirmation: validations.password.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.updatePassword({
            userId         : request.user.id,
            linkageId      : result.value.linkageId,
            currentPassword: result.value.currentPassword,
            newPassword    : result.value.newPassword
        })
        .then(function(linkage) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound') {
                return response.sendError(404, error);
            }

            if (error.name === 'IncorrectPassword') {
                return response.sendError(401, error);
            }

            next(error);
        });
    },

    updateName: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId,
            name     : request.body.name
        }, {
            linkageId: validations.id.required().options({ convert: true }),
            name     : validations.device.name.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.updateName({
            userId   : request.user.id,
            linkageId: result.value.linkageId,
            name     : result.value.name
        })
        .then(function(linkage) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound') {
                return response.sendError(404, error);
            }

            next(error);
        });
    },

    addSetting: function(request, response, next) {
        var result = this.validate({
            linkageId   : request.params.linkageId,
            medicineName: request.body.medicineName,
            schedule    : request.body.schedule
        }, {
            linkageId   : validations.id.required().options({ convert: true }),
            medicineName: validations.medicineName.required(),
            schedule    : validations.schedule.required()
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        var formattedSchedule = request.body.schedule.map(function(time) {
            return time + ':00';
        });

        this.myDevicesModel.addSetting({
            userId      : request.user.id,
            linkageId   : result.value.linkageId,
            medicineName: result.value.medicineName,
            schedule    : formattedSchedule
        })
        .then(function(setting) {
            var formattedSchedule = setting.schedule.map(function(time) {
                return time.substr(0, 5);
            });

            response.sendData(201, {
                kind        : 'DeviceSetting',
                id          : setting.id,
                medicineName: setting.medicineName,
                status      : setting.status,
                createdAt   : setting.createdAt,
                schedule    : formattedSchedule
            });
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound') {
                return response.sendError(404, error);
            }

            next(error);
        });
    },

    getSettings: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId
        }, {
            linkageId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.listSettings({
            userId   : request.user.id,
            linkageId: result.value.linkageId
        })
        .then(function(settings) {
            var formattedSettings = settings.map(function(setting) {
                return {
                    id          : setting.id,
                    medicineName: setting.medicineName,
                    schedule    : setting.schedule,
                    status      : setting.status,
                    updatedAt   : setting.updatedAt,
                    createdAt   : setting.createdAt
                };
            });

            response.sendData({
                kind    : 'DeviceSettingsList',
                settings: settings
            });
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound') {
                return response.sendError(404, error);
            }

            next(error);
        });
    },

    activateSetting: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId,
            settingId: request.params.settingId
        }, {
            linkageId: validations.id.required().options({ convert: true }),
            settingId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.activateSetting({
            userId   : request.user.id,
            linkageId: result.value.linkageId,
            settingId: result.value.settingId
        })
        .then(function(settings) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound' || error.name === 'SettingNotFound') {
                return response.sendError(404, error);
            }

            if (error.name === 'SettingAlreadyActive') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    deactivateSetting: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId,
            settingId: request.params.settingId
        }, {
            linkageId: validations.id.required().options({ convert: true }),
            settingId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.deactivateSetting({
            userId   : request.user.id,
            linkageId: result.value.linkageId,
            settingId: result.value.settingId
        })
        .then(function(settings) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound' || error.name === 'SettingNotFound') {
                return response.sendError(404, error);
            }

            if (error.name === 'SettingAlreadyInactive') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    deleteSetting: function(request, response, next) {
        var result = this.validate({
            linkageId: request.params.linkageId,
            settingId: request.params.settingId
        }, {
            linkageId: validations.id.required().options({ convert: true }),
            settingId: validations.id.required().options({ convert: true })
        });

        if (result.error) {
            return response.sendError(result.error);
        }

        this.myDevicesModel.deleteSetting({
            userId   : request.user.id,
            linkageId: result.value.linkageId,
            settingId: result.value.settingId
        })
        .then(function(settings) {
            response.status(200).send({});
        })
        .catch(function(error) {
            if (error.name === 'LinkageNotFound' || error.name === 'SettingNotFound') {
                return response.sendError(404, error);
            }

            if (error.name === 'DeleteActiveSetting') {
                return response.sendError(409, error);
            }

            next(error);
        });
    },

    config: function(request, response, next) {
        response.status(200).send({
            medicineName: 'Naproxeno',
            schedule: [
                '10:21',
                '10:22'
            ]
        });
    }

});
