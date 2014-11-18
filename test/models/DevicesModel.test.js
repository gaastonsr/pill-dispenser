'use strict';

var Promise      = require('bluebird');
var bcrypt       = require('bcrypt');
var chai         = require('chai');
var testData     = require('./data/DevicesModel.test');
var TestsHelper  = require('./../support/TestsHelper');
var DevicesModel = require('./../../models/DevicesModel');
var DeviceORM    = require('./../../ORMs/DeviceORM');

var expect       = chai.expect;
bcrypt           = Promise.promisifyAll(bcrypt);
var testsHelper  = new TestsHelper();
var devicesModel = new DevicesModel();

describe('DevicesModel', function() {

    describe('#create - when a device is created', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.create);
        });

        describe('and a device with that identifier already exists', function() {
            it('should return DuplicateIdentifier error', function() {
                return devicesModel.create({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .then(function() {
                    return Promise.reject(new Error('Creation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DuplicateIdentifier');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should save a row in the database', function() {
                return devicesModel.create({
                    identifier: '120ecaaa-a0f2-4ac4-8393-c866d8bbb123',
                    password  : 'password'
                })
                .then(function(device) {
                    return new DeviceORM({
                        id: device.id
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.be.a('number');
                        expect(model.get('identifier'));
                        expect(model.get('updatedAt')).to.be.instanceof(Date);
                        expect(model.get('createdAt')).to.be.instanceof(Date);

                        return bcrypt.compareAsync('password', model.get('password'));
                    })
                    .then(function(areSame) {
                        expect(areSame).to.equal(true);
                    });
                });
            });
        });
    });


    describe('#delete - when a device is deleted', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.delete);
        });

        describe('and that device id doesn\'t exist', function() {
            it('should return DeviceNotFound error', function() {
                return devicesModel.delete({
                    deviceId: 2
                })
                .then(function() {
                    return Promise.reject(new Error('Deletion should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DeviceNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should delete a row in the database', function() {
                return devicesModel.delete({
                    deviceId: 1
                })
                .then(function() {
                    return new DeviceORM({
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

});
