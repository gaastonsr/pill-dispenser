'use strict';

var Promise          = require('bluebird');
var bcrypt           = require('bcrypt');
var chai             = require('chai');
var testData         = require('./data/MyDevicesModel.test');
var TestsHelper      = require('./../support/TestsHelper');
var MyDevicesModel   = require('./../../models/MyDevicesModel');
var UserDeviceORM    = require('./../../ORMs/UserDeviceORM');
var DeviceORM        = require('./../../ORMs/DeviceORM');
var DeviceSettingORM = require('./../../ORMs/DeviceSettingORM');

var expect         = chai.expect;
bcrypt             = Promise.promisifyAll(bcrypt);
var testsHelper    = new TestsHelper();
var myDevicesModel = new MyDevicesModel();

describe('MyDevicesModel', function() {

    describe('#link - when a user is linked to a device', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.link);
        });

        describe('and a device with that identifier doesn\'t exist', function() {
            it('should return InvalidCredentials error', function() {
                return myDevicesModel.link({
                    name      : 'Grandpa',
                    identifier: 'idonotexist',
                    password  : 'password',
                    userId    : 1
                })
                .then(function() {
                    return Promise.reject(new Error('linkage should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidCredentials');
                });
            });
        });

        describe('and the device password is wrong', function() {
            it('should return InvalidCredentials error', function() {
                return myDevicesModel.link({
                    name      : 'Grandpa',
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'nottherealone',
                    userId    : 1
                })
                .then(function() {
                    return Promise.reject(new Error('linkage should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidCredentials');
                });
            });
        });

        describe('and the devices is already linked to the user', function() {
            it('should return AlreadyLinked error', function() {
                return myDevicesModel.link({
                    name      : 'Grandpa',
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password',
                    userId    : 1
                })
                .then(function() {
                    return Promise.reject(new Error('linkage should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('AlreadyLinked');
                });
            });
        });

        describe('and the data is fine', function() {
            var data = {
                name      : 'Grandpa',
                identifier: '110ec58a-a0f2-4ac4-8393-1a2b3c4d5e6f',
                password  : 'password',
                userId    : 1
            };

            it('should return the created linkage', function() {
                return myDevicesModel.link(data)
                .then(function(linkage) {
                    expect(linkage.id).to.equal(linkage.id);
                    expect(linkage.userId).to.equal(1);
                    expect(linkage.name).to.equal('Grandpa');
                    expect(linkage.deviceId).to.equal(2);
                    expect(linkage.updatedAt).to.instanceof(Date);
                    expect(linkage.createdAt).to.instanceof(Date);
                });
            });

            it('it should save a row in the database', function() {
                return myDevicesModel.link(data)
                .then(function(linkage) {
                    return new UserDeviceORM({
                        id: linkage.id
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.equal(linkage.id);
                        expect(model.get('userId')).to.equal(1);
                        expect(model.get('name')).to.equal('Grandpa');
                        expect(model.get('deviceId')).to.equal(2);
                        expect(model.get('updatedAt')).to.instanceof(Date);
                        expect(model.get('createdAt')).to.instanceof(Date);
                    });
                });
            });
        });
    });

    describe('#listLinkages - when a user linkages are listed', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.listLinkages);
        });

        describe('and the data is fine', function() {
            var data = {
                userId: 1
            };

            it('should return each linkage with the correct information', function() {
                return myDevicesModel.listLinkages(data)
                .then(function(linkages) {
                    expect(linkages.length).to.equal(2);

                    expect(linkages[0].id).to.equal(1);
                    expect(linkages[0].userId).to.equal(1);
                    expect(linkages[0].name).to.equal('Grandpa');
                    expect(linkages[0].deviceId).to.equal(1);
                    expect(linkages[0].updatedAt).to.instanceof(Date);
                    expect(linkages[0].createdAt).to.instanceof(Date);
                });
            });

            it('should return two linkages ordered by creation date', function() {
                return myDevicesModel.listLinkages(data)
                .then(function(linkages) {
                    expect(linkages.length).to.equal(2);
                    expect(linkages[0].id).to.equal(1);
                    expect(linkages[1].id).to.equal(2);
                });
            });
        });
    });

    describe('#unlink - when a user is unlinked from a device', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.unlink);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.unlink({
                    linkageId: 1000000,
                    userId   : 1
                })
                .then(function() {
                    return Promise.reject(new Error('Unlinkage should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.unlink({
                    linkageId: 1,
                    userId   : 2
                })
                .then(function() {
                    return Promise.reject(new Error('Unlinkage should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should remove a row from the database', function() {
                return myDevicesModel.unlink({
                    linkageId: 1,
                    userId   : 1
                })
                .then(function() {
                    return new UserDeviceORM({
                        id: 1
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model).to.equal(null);
                    });
                });
            });
        });
    });

    describe('#updatePassword - when a device password is updated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.updatePassword);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.updatePassword({
                    linkageId      : 1000000,
                    userId         : 1,
                    currentPassword: 'password',
                    newPassword    : 'newpassword'
                })
                .then(function() {
                    return Promise.reject(new Error('Password update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.updatePassword({
                    linkageId      : 1,
                    userId         : 2,
                    currentPassword: 'password',
                    newPassword    : 'newpassword'
                })
                .then(function() {
                    return Promise.reject(new Error('Password update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the password is incorrect', function() {
            it('should return IncorrectPassword error', function() {
                return myDevicesModel.updatePassword({
                    linkageId      : 1,
                    userId         : 1,
                    currentPassword: 'notthepassword',
                    newPassword    : 'newpassword'
                })
                .then(function() {
                    return Promise.reject(new Error('Password update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('IncorrectPassword');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should update the device password', function() {
                return myDevicesModel.updatePassword({
                    linkageId      : 1,
                    userId         : 1,
                    currentPassword: 'password',
                    newPassword    : 'newpassword'
                })
                .then(function() {
                    return new DeviceORM({
                        id: 1
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.equal(1);
                        // TODO: validate device updated_at timestamp got updated

                        return bcrypt.compareAsync('newpassword', model.get('password'));
                    })
                    .then(function(areSame) {
                        expect(areSame).to.equal(true);
                    });
                });
            });
        });
    });

    describe('#updateName - when a device name is updated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.updateName);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.updateName({
                    linkageId: 1000000,
                    userId   : 1,
                    name     : 'Friends Grandpa'
                })
                .then(function() {
                    return Promise.reject(new Error('Name update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.updateName({
                    linkageId: 1,
                    userId   : 2,
                    name     : 'Friends Grandpa'
                })
                .then(function() {
                    return Promise.reject(new Error('Name update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should update the device name', function() {
                return myDevicesModel.updateName({
                    linkageId: 1,
                    userId   : 1,
                    name     : 'Friends Grandpa'
                })
                .then(function() {
                    return new UserDeviceORM({
                        id: 1
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.equal(1);
                        expect(model.get('name')).to.equal('Friends Grandpa');
                        // TODO: validate device updated_at timestamp got updated
                    });
                });
            });
        });
    });

    describe('#addSetting - when a setting is added', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.addSetting);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.addSetting({
                    linkageId   : 1000000,
                    userId      : 1,
                    medicineName: 'Naproxeno',
                    schedule    : [
                        '08:00:00',
                        '16:00:00'
                    ]
                })
                .then(function() {
                    return Promise.reject(new Error('Add setting should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.addSetting({
                    linkageId   : 1,
                    userId      : 2,
                    medicineName: 'Naproxeno',
                    schedule    : [
                        '08:00:00',
                        '16:00:00'
                    ]
                })
                .then(function() {
                    return Promise.reject(new Error('Add setting should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should should save the setting in the database', function() {
                return myDevicesModel.addSetting({
                    linkageId   : 1,
                    userId      : 1,
                    medicineName: 'Naproxeno',
                    schedule    : [
                        '08:00:00',
                        '16:00:00'
                    ]
                })
                .then(function(setting) {
                    return new DeviceSettingORM({
                        id: setting.id
                    })
                    .fetch()
                    .then(function(model) {
                        var schedule = model.get('schedule');

                        expect(model.get('id')).to.equal(setting.id);
                        expect(model.get('medicineName')).to.equal('Naproxeno');
                        expect(schedule[0]).to.equal('08:00:00');
                        expect(schedule[1]).to.equal('16:00:00');
                        expect(model.get('status')).to.equal('0');
                        expect(model.get('createdAt')).to.instanceof(Date);
                    });
                });
            });

            it('should return the setting with the schedule', function() {
                return myDevicesModel.addSetting({
                    linkageId   : 1,
                    userId      : 1,
                    medicineName: 'Naproxeno',
                    schedule    : [
                        '08:00:00',
                        '16:00:00'
                    ]
                })
                .then(function(setting) {
                    expect(setting.id).to.equal(setting.id);
                    expect(setting.medicineName).to.equal('Naproxeno');
                    expect(setting.status).to.equal('0');
                    expect(setting.createdAt).to.instanceof(Date);
                    expect(setting.schedule[0]).to.equal('08:00:00');
                    expect(setting.schedule[1]).to.equal('16:00:00');
                });
            });
        });
    });

    describe('#listSettings - when a device settings are listed', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.listSettings);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.listSettings({
                    linkageId: 1000000,
                    userId   : 1
                })
                .then(function() {
                    return Promise.reject(new Error('List settings should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.listSettings({
                    linkageId: 1,
                    userId   : 2
                })
                .then(function() {
                    return Promise.reject(new Error('List settings should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should return a list of settings ordered by creation date', function() {
                return myDevicesModel.listSettings({
                    linkageId: 1,
                    userId   : 1
                })
                .then(function(settings) {
                    expect(settings.length).to.equal(2);

                    expect(settings[0].id).to.equal(1);
                    expect(settings[0].deviceId).to.equal(1);
                    expect(settings[0].medicineName).to.equal('Naproxeno');
                    expect(settings[0].schedule[0]).to.equal('08:00:00');
                    expect(settings[0].schedule[1]).to.equal('16:00:00');
                    expect(settings[0].status).to.equal('0');
                    expect(settings[0].createdAt).to.instanceof(Date);

                    expect(settings[1].id).to.equal(2);
                    expect(settings[1].deviceId).to.equal(1);
                    expect(settings[1].medicineName).to.equal('Pepto');
                    expect(settings[1].schedule[0]).to.equal('08:00:00');
                    expect(settings[1].schedule[1]).to.equal('16:00:00');
                    expect(settings[1].status).to.equal('0');
                    expect(settings[1].createdAt).to.instanceof(Date);
                });
            });
        });
    });

    describe('#activateSetting - when a device setting is activated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.activateSetting);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1000000,
                    userId   : 1,
                    settingId: 2
                })
                .then(function() {
                    return Promise.reject(new Error('Setting activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1,
                    userId   : 2,
                    settingId: 2
                })
                .then(function() {
                    return Promise.reject(new Error('Setting activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1000000
                })
                .then(function() {
                    return Promise.reject(new Error('Setting activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting belongs to another device', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 3
                })
                .then(function() {
                    return Promise.reject(new Error('Setting activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting is already active', function() {
            it('should return SettingAlreadyActive error', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Setting activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingAlreadyActive');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should set the setting as active and all others as inactive', function() {
                return myDevicesModel.activateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 2
                })
                .then(function() {
                    return new DeviceSettingORM()
                    .query(function(queryBuider) {
                        queryBuider
                        .where('device_id', 1)
                        .orderBy('id', 'asc');
                    })
                    .fetchAll()
                    .then(function(collection) {
                        var rows = collection.toJSON();

                        expect(rows.length).to.equal(2);
                        expect(rows[0].id).to.equal(1);
                        expect(rows[0].status).to.equal('0');
                        expect(rows[1].id).to.equal(2);
                        expect(rows[1].status).to.equal('1');
                    });
                });
            });
        });
    });

    describe('#deactivateSetting - when a device setting is deactivated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.deactivateSetting);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1000000,
                    userId   : 1,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Setting deactivation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1,
                    userId   : 2,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Setting deactivation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1000000
                })
                .then(function() {
                    return Promise.reject(new Error('Setting deactivation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting belongs to another device', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 3
                })
                .then(function() {
                    return Promise.reject(new Error('Setting deactivation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting is already inactive', function() {
            it('should return SettingAlreadyInactive error', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 2
                })
                .then(function() {
                    return Promise.reject(new Error('Setting deactivation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingAlreadyInactive');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should set the setting as inactive', function() {
                return myDevicesModel.deactivateSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1
                })
                .then(function() {
                    return new DeviceSettingORM()
                    .query(function(queryBuider) {
                        queryBuider
                        .where('device_id', 1)
                        .orderBy('id', 'asc');
                    })
                    .fetchAll()
                    .then(function(collection) {
                        var rows = collection.toJSON();

                        expect(rows.length).to.equal(2);
                        expect(rows[0].id).to.equal(1);
                        expect(rows[0].status).to.equal('0');
                        expect(rows[1].id).to.equal(2);
                        expect(rows[1].status).to.equal('0');
                    });
                });
            });
        });
    });

    describe('#deleteSetting - when a device setting is deleted', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.deleteSetting);
        });

        describe('and the linkage id doesn\'t exist', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1000000,
                    userId   : 1,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the linkage belongs to another user', function() {
            it('should return LinkageNotFound error', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1,
                    userId   : 2,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('LinkageNotFound');
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1000000
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting belongs to another device', function() {
            it('should return SettingNotFound error', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 3
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('SettingNotFound');
                });
            });
        });

        describe('and the setting is already inactive', function() {
            it('should return DeleteActiveSetting error', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 1
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DeleteActiveSetting');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should delete the row of the database', function() {
                return myDevicesModel.deleteSetting({
                    linkageId: 1,
                    userId   : 1,
                    settingId: 2
                })
                .then(function() {
                    return new DeviceSettingORM()
                    .query(function(queryBuider) {
                        queryBuider
                        .where('device_id', 1)
                        .orderBy('id', 'asc');
                    })
                    .fetchAll()
                    .then(function(collection) {
                        var rows = collection.toJSON();

                        expect(rows.length).to.equal(1);
                        expect(rows[0].id).to.equal(1);
                        expect(rows[0].status).to.equal('1');
                    });
                });
            });
        });
    });

});
