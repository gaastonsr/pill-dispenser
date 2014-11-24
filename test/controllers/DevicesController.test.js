'use strict';

var Promise           = require('bluebird');
var sinon             = require('sinon');
var express           = require('express');
var bodyParser        = require('body-parser');
var request           = require('supertest');
var chai              = require('chai');
var toolkit           = require('./../../libs/api-toolkit');
var DevicesModel      = require('./../../models/DevicesModel');
var DevicesController = require('./../../controllers/DevicesController');

var expect          = chai.expect;
var devicesModel      = new DevicesModel();
var devicesController = new DevicesController(devicesModel);

/* FAKE SERVER STUFF */
var app    = express();
var router = express.Router();

var checkSession = function(request, response, next) {
    request.user = {
        id: 1
    };

    next();
};

router.post(  '/devices'    , checkSession, devicesController.register);
router.delete('/devices/:id', checkSession, devicesController.delete);

app.use(bodyParser.json());
app.use(toolkit.energizer());
app.use(router);
// app.use(function(error, request, response, next) {
//     console.log(error.stack);
//     response.status(500).send();
// });
/* FAKE SERVER STUFF */

chai.use(require('chai-things'));

describe('DevicesController', function() {

    describe('#register - when a device is registered', function() {
        var model  = devicesModel;
        var method = 'create';
        var route = {
            verb: 'post',
            path: '/devices'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the required fields are not sent', function() {
            it('should return ValidationError', function(done) {
                request(app)
                [route.verb](route.path)
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('ValidationError');
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'identifier');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'password');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the identifier is duplicated', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = 'DuplicateIdentifier';
                    return Promise.reject(error);
                });
            });

            it('should return DuplicateIdentifier error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(409);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('DuplicateIdentifier');
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var creationDate = new Date();

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve({
                        id        : 1000,
                        identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                        updatedAt: creationDate,
                        createdAt: creationDate
                    });
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                        password  : 'password'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the device created', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(201);
                    expect(body.data.kind).to.equal('DeviceProfile');
                    expect(body.data.id).to.equal(1000);
                    expect(body.data.identifier).to.equal('110ec58a-a0f2-4ac4-8393-c866d813b8d1');
                    expect(body.data.updatedAt).to.equal(creationDate.toISOString());
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());

                    done();
                });
            });
        });
    });

    describe('#delete - when a device is deleted', function() {
        var model  = devicesModel;
        var method = 'delete';
        var route = {
            verb: 'delete',
            path: '/devices/1'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the device id is not an integer', function() {
            it('should return ValidationError', function(done) {
                request(app)
                [route.verb](route.path + 'aaa')
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('ValidationError');
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'deviceId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the device doesn\'t exist', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = 'DeviceNotFound';
                    return Promise.reject(error);
                });
            });

            it('should return DeviceNotFound error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
                    password  : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(404);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('DeviceNotFound');
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve();
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        deviceId: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

});
