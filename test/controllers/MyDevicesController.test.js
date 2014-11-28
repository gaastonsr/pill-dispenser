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
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#updatePassword - when a device password is updated', function() {
        var route  = routes.updatePassword;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#updateName - when a device name is updated', function() {
        var route  = routes.updateName;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#addSetting - when a setting is added to a device', function() {
        var route  = routes.addSetting;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#getSettings - when a device settings are listed', function() {
        var route  = routes.getSettings;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#activateSetting - when a device setting is activated', function() {
        var route  = routes.activateSetting;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#deactivateSetting - when a device setting is deactivated', function() {
        var route  = routes.deactivateSetting;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

    describe('#deleteSetting - when device setting is deleted', function() {
        var route  = routes.deleteSetting;
        var model  = myDevicesModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });
    });

});
