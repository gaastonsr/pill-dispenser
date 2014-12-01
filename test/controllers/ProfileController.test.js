'use strict';

var Promise           = require('bluebird');
var sinon             = require('sinon');
var request           = require('supertest');
var chai              = require('chai');
var config            = require('config');
var TestsHelper       = require('./../support/TestsHelper');
var fakeApp           = require('./../support/fake-app');
var Mailer            = require('./../../libs/Mailer');
var UsersModel        = require('./../../models/UsersModel');
var ProfileController = require('./../../controllers/ProfileController');

chai.use(require('chai-things'));

var expect            = chai.expect;
var mailer            = sinon.createStubInstance(Mailer);
var usersModel        = new UsersModel();
var profileController = new ProfileController(mailer, usersModel);

/* FAKE APP STUFF */
var routes = {
    get: {
        verb: 'get',
        path: '/profile'
    },
    update: {
        verb: 'put',
        path: '/profile'
    },
    updatePassword: {
        verb: 'put',
        path: '/profile/password'
    },
    requestEmailUpdate: {
        verb: 'post',
        path: '/profile/email-update-request'
    },
    updateEmail: {
        verb: 'put',
        path: '/profile/email/:token'
    }
};

var app = fakeApp(profileController, routes);
/* FAKE APP STUFF */

describe('ProfileController', function() {

    describe('#get - when a user profile is fetched', function() {
        var route  = routes.get;
        var model  = usersModel;
        var method = 'getById';

        afterEach(function() {
            if (model[method].restore) {
                model[method].restore();
            }
        });

        describe('and an unknown error happens', function() {
            var creationDate = new Date();

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return 500 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            var creationDate = new Date();

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve({
                        id              : 1,
                        name            : 'John Doe',
                        email           : 'john@doe.com',
                        updatedAt       : creationDate,
                        createdAt       : creationDate
                    });
                });
            });

            it('should call model.method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        id: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the user profile', function(done) {
                request(app)
                [route.verb](route.path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(200);
                    expect(body.data.kind).to.equal('UserProfile');
                    expect(body.data.id).to.equal(1);
                    expect(body.data.name).to.equal('John Doe');
                    expect(body.data.email).to.equal('john@doe.com');
                    expect(body.data.updatedAt).to.equal(creationDate.toISOString());
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());

                    done();
                });
            });
        });
    });

    describe('#update - when a profile is updated', function() {
        var route  = routes.update;
        var model  = usersModel;
        var method = 'update';

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

            it('should return 500 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            var updateDate   = new Date();
            var creationDate = new Date().setHours(updateDate.getHours() - 1);

            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve({
                        id       : 1,
                        name     : 'J. Doe',
                        email    : 'john@doe.com',
                        updatedAt: updateDate,
                        createdAt: creationDate
                    });
                });
            });

            it('should call model.method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId: 1,
                        name  : 'J. Doe'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#updatePassword - when a password is updated', function() {
        var route  = routes.updatePassword;
        var model  = usersModel;
        var method = 'updatePassword';

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
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'currentPassword');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newPassword');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newPasswordConfirmation');

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

            it('should return 500 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    currentPassword        : 'password',
                    newPassword            : 'notaneasyone',
                    newPasswordConfirmation: 'notaneasyone'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the current password is incorrect', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error('Incorrect password');
                    error.name = 'IncorrectPassword';
                    return Promise.reject(error);
                });
            });

            it('should return IncorrectPassword error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    currentPassword        : 'password',
                    newPassword            : 'notaneasyone',
                    newPasswordConfirmation: 'notaneasyone'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(401);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('IncorrectPassword');

                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve();
                });
            });

            it('should call model.method with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    currentPassword        : 'password',
                    newPassword            : 'notaneasyone',
                    newPasswordConfirmation: 'notaneasyone'
                })
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        userId         : 1,
                        currentPassword: 'password',
                        newPassword    : 'notaneasyone'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return http code 200', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    currentPassword        : 'password',
                    newPassword            : 'notaneasyone',
                    newPasswordConfirmation: 'notaneasyone'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

    describe('#requestEmailUpdate - when an email update is requested', function() {
        var route  = routes.requestEmailUpdate;
        var model  = usersModel;
        var method = 'requestEmailUpdate';

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
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'password');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newEmail');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'newEmailConfirmation');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            beforeEach(function() {
                sinon.stub(model, 'requestEmailUpdate', function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return 500 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the password is incorrect', function() {
            beforeEach(function() {
                sinon.stub(model, 'requestEmailUpdate', function() {
                    var error  = new Error('Incorrect password');
                    error.name = 'IncorrectPassword';
                    return Promise.reject(error);
                });
            });

            it('should return IncorrectPassword error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(401);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('IncorrectPassword');

                    done();
                });
            });
        });

        describe('and the newEmail is already in use by another user', function() {
            beforeEach(function() {
                sinon.stub(model, 'requestEmailUpdate', function() {
                    var error  = new Error('Duplicate email');
                    error.name = 'DuplicateEmail';
                    return Promise.reject(error);
                });
            });

            it('should return DuplicateEmail error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(409);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('DuplicateEmail');

                    done();
                });
            });
        });

        describe('and a request to update the email by newEmail already exists', function() {
            beforeEach(function() {
                sinon.stub(model, 'requestEmailUpdate', function() {
                    var error  = new Error('Duplicate request');
                    error.name = 'DuplicateRequest';
                    return Promise.reject(error);
                });
            });

            it('should return DuplicateRequest error', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(409);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('DuplicateRequest');

                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            beforeEach(function() {
                sinon.stub(model, 'requestEmailUpdate', function() {
                    return Promise.resolve({
                        email           : 'john@doe.com',
                        emailUpdateToken: 'somerandomtoken'
                    });
                });
            });

            it('should call mailer.sendMail with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    expect(mailer.sendMail.calledOnce).to.equal(true);
                    expect(mailer.sendMail.calledWith('email-update-request', {
                        emailConfirmationURL: config.get('websiteURL') + '/confirmar-correo/somerandomtoken'
                    }, {
                        to     : 'john@doe.com',
                        subject: 'Confirmación de Dirección de Correo'
                    })).to.equal(true);

                    done();
                });
            });

            it('should call usersModel.requestEmailUpdate with the right arguments', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    expect(usersModel.requestEmailUpdate.calledOnce).to.equal(true);
                    expect(usersModel.requestEmailUpdate.calledWith({
                        userId  : 1,
                        newEmail: 'jdoe@gmail.com',
                        password: 'password'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http code', function(done) {
                request(app)
                [route.verb](route.path)
                .send({
                    password            : 'password',
                    newEmail            : 'jdoe@gmail.com',
                    newEmailConfirmation: 'jdoe@gmail.com'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(201);
                    done();
                });
            });
        });
    });

    describe('#updateEmail - when an email is updated', function() {
        var route  = routes.updateEmail;
        var model  = usersModel;
        var method = 'updateEmail';
        var params = {
            token: 'randomtoken'
        };

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

            it('should return 500 http code', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the supplied token is invalid', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
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

                    done();
                });
            });
        });

        describe('and the email update request is expired', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    var error  = new Error();
                    error.name = 'ExpiredEmailUpdateRequest';
                    return Promise.reject(error);
                });
            });

            it('should return ExpiredEmailUpdateRequest error', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(410);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('ExpiredEmailUpdateRequest');

                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            beforeEach(function() {
                model[method] = sinon.spy(function() {
                    return Promise.resolve();
                });
            });

            it('should call model.method with the right arguments', function(done) {
                var path = TestsHelper.replaceParams(route.path, params);

                request(app)
                [route.verb](path)
                .end(function(error, response) {
                    expect(model[method].calledOnce).to.equal(true);
                    expect(model[method].calledWith({
                        emailUpdateToken: 'randomtoken'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http code', function(done) {
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
