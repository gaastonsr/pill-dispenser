'use strict';

var Promise         = require('bluebird');
var sinon           = require('sinon');
var request         = require('supertest');
var chai            = require('chai');
var config          = require('config');
var TestsHelper     = require('./../support/TestsHelper');
var fakeApp         = require('./../support/fake-app');
var Mailer          = require('./../../libs/Mailer');
var UsersModel      = require('./../../models/UsersModel');
var UsersController = require('./../../controllers/UsersController');

chai.use(require('chai-things'));

var expect          = chai.expect;
var mailer          = sinon.createStubInstance(Mailer);
var usersModel      = new UsersModel();
var usersController = new UsersController(mailer, usersModel);

/* FAKE APP STUFF */
var routes = {
    create: {
        verb: 'post',
        path: '/users'
    },
    activate: {
        verb: 'put',
        path: '/users/activate/:token'
    }
};

var app = fakeApp(usersController, routes);
/* FAKE APP STUFF */

describe('UsersController', function() {

    describe('#create - when a user is created', function() {
        var route  = routes.create;
        var model  = usersModel;
        var method = 'create';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }

            mailer.sendMail.reset();
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
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'email');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'emailConfirmation');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'password');

                    done();
                });
            });
        });

        describe('and the email is duplicated', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('We already have a user registered with that email');
                    error.name = 'DuplicateEmail';
                    return Promise.reject(error);
                });
            });

            it('should return DuplicateEmail error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(409);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('DuplicateEmail');
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and a unknown error happens', function() {
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
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var creationDate = new Date();

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve({
                        id             : 1000,
                        name           : 'John Doe',
                        email          : 'john@doe.com',
                        status         : '0',
                        updatedAt      : creationDate,
                        createdAt      : creationDate,
                        activationToken: 'somerandomtoken'
                    });
                });
            });

            it('should call mailer.sendMail with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    expect(mailer.sendMail.calledOnce).to.equal(true);
                    expect(mailer.sendMail.calledWith('account-activation', {
                        emailConfirmationURL: config.get('websiteURL') + '/activar-cuenta/somerandomtoken'
                    }, {
                        to     : 'john@doe.com',
                        subject: 'Activación de Cuenta'
                    })).to.equal(true);

                    done();
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        name    : 'John Doe',
                        email   : 'john@doe.com',
                        password: 'password'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the created resource', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(201);
                    expect(body.data.kind).to.equal('UserProfile');
                    expect(body.data.id).to.equal(1000);
                    expect(body.data.name).to.equal('John Doe');
                    expect(body.data.email).to.equal('john@doe.com');
                    expect(body.data.updatedAt).to.equal(creationDate.toISOString());
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());

                    done();
                });
            });
        });
    });

    describe('#activate - when a user is activated', function() {
        var route  = routes.activate;
        var model  = usersModel;
        var method = 'activate';
        var params = {
            token: 'randomtoken'
        };

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and the token is invalid', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('Invalid token');
                    error.name = 'InvalidToken';
                    return Promise.reject(error);
                });
            });

            it('should return InvalidToken error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('InvalidToken');
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the user is already active', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('User already active');
                    error.name = 'UserAlreadyActive';
                    return Promise.reject(error);
                });
            });

            it('should return UserAlreadyActive error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('UserAlreadyActive');
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
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var updateDate   = new Date();
            var creationDate = new Date().setHours(updateDate.getHours() - 1);

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve({
                        id       : 1000,
                        name     : 'John Doe',
                        email    : 'john@doe.com',
                        status   : '0',
                        updatedAt: updateDate,
                        createdAt: creationDate
                    });
                });
            });

            it('should call model.method method with the right arguments', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        activationToken: 'randomtoken'
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


