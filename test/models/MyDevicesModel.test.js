'use strict';

var Promise        = require('bluebird');
var bcrypt         = require('bcrypt');
var chai           = require('chai');
var testData       = require('./data/MyDevicesModel.test');
var TestsHelper    = require('./../support/TestsHelper');
var MyDevicesModel = require('./../../models/MyDevicesModel');
var UserDeviceORM  = require('./../../ORMs/UserDeviceORM');
var DeviceORM      = require('./../../ORMs/DeviceORM');

var testsHelper    = new TestsHelper();
var myDevicesModel = new MyDevicesModel();

var expect = chai.expect;
bcrypt     = Promise.promisifyAll(bcrypt);

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
            it('it should save a row in the database', function() {
                return myDevicesModel.link({
                    name      : 'Grandpa',
                    identifier: '110ec58a-a0f2-4ac4-8393-1a2b3c4d5e6f',
                    password  : 'password',
                    userId    : 1
                })
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

});
