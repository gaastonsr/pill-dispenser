'use strict';

var Promise             = require('bluebird');
var sinon               = require('sinon');
var request             = require('supertest');
var chai                = require('chai');
var TestsHelper         = require('./../support/TestsHelper');
var fakeApp             = require('./../support/fake-app');
var MyDevicesModel      = require('./../../models/MyDevicesModel');
var MyDevicesController = require('./../../controllers/MyDevicesController');

chai.use(require('chai-things'));

var expect              = chai.expect;
var myDevicesModel      = new MyDevicesModel();
var myDevicesController = new MyDevicesController(myDevicesModel);

/* FAKE APP STUFF */
var routes = {
    link: {
        verb: 'post',
        path: '/my-devices'
    },
    list: {
        verb: 'get',
        path: '/my-devices'
    },
    unlink: {
        verb: 'delete',
        path: '/my-devices/:linkageId'
    },
    updatePassword: {
        verb: 'put',
        path: '/my-devices/:linkageId/password'
    },
    updateName: {
        verb: 'put',
        path: '/my-devices/:linkageId/name'
    },
    addSetting: {
        verb: 'post',
        path: '/my-devices/:linkageId/settings'
    },
    getSettings: {
        verb: 'get',
        path: '/my-devices/:linkageId/settings'
    },
    activateSetting: {
        verb: 'put',
        path: '/my-devices/:linkageId/settings/:settingId/activate'
    },
    deactivateSetting: {
        verb: 'put',
        path: '/my-devices/:linkageId/settings/:settingId/deactivate'
    },
    deleteSetting: {
        verb: 'delete',
        path: '/my-devices/:linkageId/settings/:settingId'
    }
};

var app = fakeApp(myDevicesController, routes);
/* FAKE APP STUFF */

describe('MyDevicesController', function() {

    describe('#link - when a user is linked to a device', function() {
        var route  = routes.link;
        var model  = myDevicesModel;
        var method = 'link';
        var payload = {
            name      : 'Grandpa',
            identifier: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
            password  : 'password'
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
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'name');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'identifier');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'password');

                    done();
                });
            });
        });

        describe('and the credentials are invalid', function() {
            var errorCode = 401;
            var errorName = 'InvalidCredentials';

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                request(app)
                [route.verb](route.path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the the device is already linked', function() {
            var errorCode = 409;
            var errorName = 'AlreadyLinked';

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                request(app)
                [route.verb](route.path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

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
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var creationDate = new Date();
            var fulfillment = {
                id       : 1000,
                name     : payload.name,
                updatedAt: creationDate,
                createdAt: creationDate
            };

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve(fulfillment);
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send(payload)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId    : 1,
                        name      : payload.name,
                        identifier: payload.identifier,
                        password  : payload.password
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the device created', function(done) {
                request(app)
                [route.verb](route.path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(201);
                    expect(body.data.kind).to.equal('DeviceLinkage');
                    expect(body.data.id).to.equal(fulfillment.id);
                    expect(body.data.name).to.equal(payload.name);
                    expect(body.data.updatedAt).to.equal(creationDate.toISOString());
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());

                    done();
                });
            });
        });
    });

    describe('#list - when a user linkages are listed', function() {
        var route  = routes.list;
        var model  = myDevicesModel;
        var method = 'listLinkages';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
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

        describe('and the data is fine', function() {
            var creationDate = new Date();
            var fulfillment = [
                {
                    id       : 1000,
                    name     : 'Grandpa',
                    updatedAt: creationDate,
                    createdAt: creationDate
                },
                {
                    id       : 1001,
                    name     : 'Uncle',
                    updatedAt: creationDate,
                    createdAt: creationDate
                }
            ];

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve(fulfillment);
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the device created', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(200);
                    expect(body.data.kind).to.equal('LinkagesList');

                    fulfillment.forEach(function(linkage, index) {
                        expect(body.data.linkages[index].id).to.equal(linkage.id);
                        expect(body.data.linkages[index].name).to.equal(linkage.name);
                        expect(body.data.linkages[index].updatedAt).to.equal(linkage.updatedAt.toISOString());
                        expect(body.data.linkages[index].createdAt).to.equal(linkage.createdAt.toISOString());
                    });

                    done();
                });
            });
        });
    });

    describe('#unlink - when a device is unlinked from a user', function() {
        var route  = routes.unlink;
        var model  = myDevicesModel;
        var method = 'unlink';
        var params = {
            linkageId: '1'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the linkage id is not an integer', function() {
            it('should return ValidationError', function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa'
                });

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('ValidationError');
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#updatePassword - when a device password is updated', function() {
        var route  = routes.updatePassword;
        var model  = myDevicesModel;
        var method = 'updatePassword';
        var params = {
            linkageId: '1'
        };
        var payload = {
            currentPassword        : 'password',
            newPassword            : 'newpassword',
            newPasswordConfirmation: 'newpassword'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the required fields are not sent', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'currentPassword');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newPassword');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newPasswordConfirmation');

                    done();
                });
            });
        });

        describe('and the linkage id is not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa'
                });

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage id doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the password is incorrect', function() {
            var errorName = 'IncorrectPassword';
            var errorCode = 401;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId         : 1,
                        linkageId      : 1,
                        currentPassword: 'password',
                        newPassword    : 'newpassword'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#updateName - when a device name is updated', function() {
        var route  = routes.updateName;
        var model  = myDevicesModel;
        var method = 'updateName';
        var params = {
            linkageId: '1'
        };
        var payload = {
            name: 'Uncle'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the required fields are not sent', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'name');

                    done();
                });
            });
        });

        describe('and the linkage id is not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa'
                });

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage id doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1,
                        name     : 'Uncle'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#addSetting - when a setting is added to a device', function() {
        var route  = routes.addSetting;
        var model  = myDevicesModel;
        var method = 'addSetting';
        var params = {
            linkageId: '1'
        };
        var payload = {
            medicineName: 'Naproxeno',
            schedule: [
                '08:00',
                '16:00'
            ]
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the required fields are not sent', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'medicineName');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'schedule');

                    done();
                });
            });
        });

        describe('and the linkage id is not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa'
                });

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage id doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                        id          : 1000,
                        medicineName: 'Naproxeno',
                        status      : '0',
                        updatedAt   : creationDate,
                        createdAt   : creationDate,
                        schedule: [
                            '08:00:00',
                            '16:00:00'
                        ]
                    });
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId      : 1,
                        linkageId   : 1,
                        medicineName: 'Naproxeno',
                        schedule: [
                            '08:00:00',
                            '16:00:00'
                        ]
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .send(payload)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(201);
                    expect(body.data.kind).to.equal('DeviceSetting');
                    expect(body.data.id).to.equal(1000);
                    expect(body.data.medicineName).to.equal('Naproxeno');
                    expect(body.data.status).to.equal('0');
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());
                    expect(body.data.schedule[0]).to.equal('08:00');
                    expect(body.data.schedule[1]).to.equal('16:00');

                    done();
                });
            });
        });
    });

    describe('#getSettings - when a device settings are listed', function() {
        var route  = routes.getSettings;
        var model  = myDevicesModel;
        var method = 'listSettings';
        var params = {
            linkageId: '1'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the linkage id is not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa'
                });

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage id doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var creationDate = new Date();
            var fulfillment = [
                {
                    id          : 1,
                    deviceId    : 1,
                    medicineName: 'Naproxeno',
                    status      : '0',
                    createdAt   : creationDate,
                    schedule: [
                        '08:00',
                        '16:00'
                    ]
                },
                {
                    id          : 1,
                    deviceId    : 1,
                    medicineName: 'Pepto-Bismol',
                    status      : '0',
                    createdAt   : creationDate,
                    schedule: [
                        '09:00',
                        '17:00'
                    ]
                }
            ];

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve(fulfillment);
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(200);
                    expect(body.data.kind).to.equal('DeviceSettingsList');

                    fulfillment.forEach(function(setting, index) {
                        expect(body.data.settings[index].id).to.equal(setting.id);
                        expect(body.data.settings[index].medicineName).to.equal(setting.medicineName);
                        expect(body.data.settings[index].status).to.equal(setting.status);
                        expect(body.data.settings[index].createdAt).to.equal(setting.createdAt.toISOString());

                        setting.schedule.forEach(function(time, index2) {
                            expect(body.data.settings[index].schedule[index2]).to.equal(time);
                        });
                    });

                    done();
                });
            });
        });
    });

    describe('#activateSetting - when a device setting is activated', function() {
        var route  = routes.activateSetting;
        var model  = myDevicesModel;
        var method = 'activateSetting';
        var params = {
            linkageId: '1',
            settingId: '2'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the linkage and setting id are not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa',
                    settingId: 'bbb'
                });

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'settingId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            var errorName = 'SettingNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting is already active', function() {
            var errorName = 'SettingAlreadyActive';
            var errorCode = 409;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1,
                        settingId: 2
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#deactivateSetting - when a device setting is deactivated', function() {
        var route  = routes.deactivateSetting;
        var model  = myDevicesModel;
        var method = 'deactivateSetting';
        var params = {
            linkageId: '1',
            settingId: '2'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the linkage and setting id are not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa',
                    settingId: 'bbb'
                });

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'settingId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            var errorName = 'SettingNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting is already inactive', function() {
            var errorName = 'SettingAlreadyInactive';
            var errorCode = 409;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1,
                        settingId: 2
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#deleteSetting - when device setting is deleted', function() {
        var route  = routes.deleteSetting;
        var model  = myDevicesModel;
        var method = 'deleteSetting';
        var params = {
            linkageId: '1',
            settingId: '2'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the linkage and setting id are not an integer', function() {
            var errorName = 'ValidationError';
            var errorCode = 400;

            it('should return ' + errorName, function(done) {
                var path = TestsHelper.replaceParams(route.path, {
                    linkageId: 'aaa',
                    settingId: 'bbb'
                });

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'linkageId');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'settingId');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            var errorName = 'UnknownError';
            var errorCode = 500;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return http status code 500', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(errorCode);
                    done();
                });
            });
        });

        describe('and the linkage doesn\'t exist', function() {
            var errorName = 'LinkageNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting doesn\'t exist', function() {
            var errorName = 'SettingNotFound';
            var errorCode = 404;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the setting is active', function() {
            var errorName = 'DeleteActiveSetting';
            var errorCode = 409;

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = errorName;
                    return Promise.reject(error);
                });
            });

            it('should return ' + errorName + ' error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(errorCode);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal(errorName);
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId   : 1,
                        linkageId: 1,
                        settingId: 2
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

});
