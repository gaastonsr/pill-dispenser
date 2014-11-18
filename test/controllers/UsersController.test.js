'use strict';

var Promise         = require('bluebird');
var sinon           = require('sinon');
var _               = require('underscore');
var express         = require('express');
var bodyParser      = require('body-parser');
var request         = require('supertest');
var chai            = require('chai');
var UsersController = require('./../../controllers/UsersController');

var expect          = chai.expect;
var usersModelStub  = {
    create  : function() {},
    activate: function() {}
};
var usersController = new UsersController(usersModelStub);

/* FAKE SERVER STUFF */
var app    = express();
var router = express.Router();

// make sure controller functions have as context themselves
_.bindAll.apply(_, [usersController].concat(_.functions(usersController)));

router.post('/users'                , usersController.create);
router.put( '/users/activate/:token', usersController.activate);

app.use(bodyParser.json());
app.use(router);
/* FAKE SERVER STUFF */

chai.use(require('chai-things'));

Promise.onPossiblyUnhandledRejection(function(reason, promise) {
    // avoid printing false positive errors
    // necessary because our stubs create rejected promises before they
    // have an error handler firing a "possibly unhandled rejection" error
});

describe('UsersController', function() {

    describe('#create - when a user is created', function() {
        describe('and the required fields are not sent', function() {
            it('should return ValidationError', function(done) {
                request(app)
                .post('/users')
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
            before(function() {
                var error   = new Error('We already have a user registered with that email');
                error.name  = 'DuplicateEmail';
                var promise = Promise.reject(error);

                sinon.stub(usersModelStub, 'create').returns(promise);
            });

            after(function() {
                expect(usersModelStub.create.calledOnce).to.equal(true);
                expect(usersModelStub.create.calledWith({
                    name    : 'John Doe',
                    email   : 'john@doe.com',
                    password: 'password'
                })).to.equal(true);

                usersModelStub.create.restore();
            });

            it('should return DuplicateEmail error', function(done) {
                request(app)
                .post('/users')
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
            before(function() {
                var error   = new Error('Unknown error');
                error.name  = 'UnknownError';
                var promise = Promise.reject(error);

                sinon.stub(usersModelStub, 'create').returns(promise);
            });

            after(function() {
                expect(usersModelStub.create.calledOnce).to.equal(true);
                expect(usersModelStub.create.calledWith({
                    name    : 'John Doe',
                    email   : 'john@doe.com',
                    password: 'password'
                })).to.equal(true);

                usersModelStub.create.restore();
            });

            it('should return ServerError', function(done) {
                request(app)
                .post('/users')
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

            before(function() {
                var promise = Promise.resolve({
                    id       : 1000,
                    name     : 'John Doe',
                    email    : 'john@doe.com',
                    status   : '0',
                    updatedAt: creationDate,
                    createdAt: creationDate
                });

                sinon.stub(usersModelStub, 'create').returns(promise);
            });

            after(function() {
                expect(usersModelStub.create.calledOnce).to.equal(true);
                expect(usersModelStub.create.calledWith({
                    name    : 'John Doe',
                    email   : 'john@doe.com',
                    password: 'password'
                })).to.equal(true);

                usersModelStub.create.restore();
            });

            it('should return the created resource', function(done) {
                request(app)
                .post('/users')
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    var body = response.body;

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
        describe('and the token is invalid', function() {
            before(function() {
                var error   = new Error('Invalid token');
                error.name  = 'InvalidToken';
                var promise = Promise.reject(error);

                sinon.stub(usersModelStub, 'activate').returns(promise);
            });

            after(function() {
                expect(usersModelStub.activate.calledOnce).to.equal(true);
                expect(usersModelStub.activate.calledWith({
                    activationToken: 'somerandomtoken'
                })).to.equal(true);

                usersModelStub.activate.restore();
            });

            it('should return InvalidToken error', function(done) {
                request(app)
                .put('/users/activate/somerandomtoken')
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
            before(function() {
                var error   = new Error('User already active');
                error.name  = 'UserAlreadyActive';
                var promise = Promise.reject(error);

                sinon.stub(usersModelStub, 'activate').returns(promise);
            });

            after(function() {
                expect(usersModelStub.activate.calledOnce).to.equal(true);
                expect(usersModelStub.activate.calledWith({
                    activationToken: 'somerandomtoken'
                })).to.equal(true);

                usersModelStub.activate.restore();
            });

            it('should return UserAlreadyActive error', function(done) {
                request(app)
                .put('/users/activate/somerandomtoken')
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
            before(function() {
                var error   = new Error('Unknown error');
                error.name  = 'UnknownError';
                var promise = Promise.reject(error);

                sinon.stub(usersModelStub, 'activate').returns(promise);
            });

            after(function() {
                expect(usersModelStub.activate.calledOnce).to.equal(true);
                expect(usersModelStub.activate.calledWith({
                    activationToken: 'somerandomtoken'
                })).to.equal(true);

                usersModelStub.activate.restore();
            });

            it('should return UserAlreadyActive error', function(done) {
                request(app)
                .put('/users/activate/somerandomtoken')
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and the data is fine', function() {
            var updateDate   = new Date();
            var creationDate = new Date().setHours(updateDate.getHours() - 1);

            before(function() {
                var promise = Promise.resolve({
                    id       : 1000,
                    name     : 'John Doe',
                    email    : 'john@doe.com',
                    status   : '0',
                    updatedAt: updateDate,
                    createdAt: creationDate
                });

                sinon.stub(usersModelStub, 'activate').returns(promise);
            });

            after(function() {
                expect(usersModelStub.activate.calledOnce).to.equal(true);
                expect(usersModelStub.activate.calledWith({
                    activationToken: 'somerandomtoken'
                })).to.equal(true);

                usersModelStub.activate.restore();
            });

            it('should return UserAlreadyActive error', function(done) {
                request(app)
                .put('/users/activate/somerandomtoken')
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

});


