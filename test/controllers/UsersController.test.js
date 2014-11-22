'use strict';

var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
var express         = require('express');
var bodyParser      = require('body-parser');
var request         = require('supertest');
var chai            = require('chai');
var UsersModel      = require('./../../models/UsersModel');
var UsersController = require('./../../controllers/UsersController');

var expect          = chai.expect;
var usersModel      = sinon.createStubInstance(UsersModel);
var usersController = new UsersController(usersModel);

/* FAKE SERVER STUFF */
var app    = express();
var router = express.Router();

router.post('/users'                , usersController.create);
router.put( '/users/activate/:token', usersController.activate);

app.use(bodyParser.json());
app.use(router);
/* FAKE SERVER STUFF */

chai.use(require('chai-things'));

describe('UsersController', function() {

    describe('#create - when a user is created', function() {
        beforeEach(function() {
            usersModel.create.reset();
        });

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
                var error  = new Error('We already have a user registered with that email');
                error.name = 'DuplicateEmail';
                usersModel.create.rejects(error);
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
                var error  = new Error('Unknown error');
                error.name = 'UnknownError';
                usersModel.create.rejects(error);
            });

            it('should return http status code 500', function(done) {
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
                usersModel.create.resolves({
                    id             : 1000,
                    name           : 'John Doe',
                    email          : 'john@doe.com',
                    status         : '0',
                    updatedAt      : creationDate,
                    createdAt      : creationDate,
                    activationToken: 'somerandomtoken'
                });
            });

            it('should call usersModel.created method with the right arguments', function(done) {
                request(app)
                .post('/users')
                .send({
                    name             : 'John Doe',
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com',
                    password         : 'password'
                })
                .end(function(error, response) {
                    expect(usersModel.create.calledOnce).to.equal(true);
                    expect(usersModel.create.calledWith({
                        name    : 'John Doe',
                        email   : 'john@doe.com',
                        password: 'password'
                    })).to.equal(true);

                    done();
                });
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
        beforeEach(function() {
            usersModel.activate.reset();
        });

        describe('and the token is invalid', function() {
            before(function() {
                var error  = new Error('Invalid token');
                error.name = 'InvalidToken';
                usersModel.activate.rejects(error);
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
                var error  = new Error('User already active');
                error.name = 'UserAlreadyActive';
                usersModel.activate.rejects(error);
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
                var error  = new Error('Unknown error');
                error.name = 'UnknownError';
                usersModel.activate.rejects(error);
            });

            it('should return http status code 500', function(done) {
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
                usersModel.activate.resolves({
                    id       : 1000,
                    name     : 'John Doe',
                    email    : 'john@doe.com',
                    status   : '0',
                    updatedAt: updateDate,
                    createdAt: creationDate
                });
            });

            it('should call usersModel.activate method with the right arguments', function(done) {
                request(app)
                .put('/users/activate/somerandomtoken')
                .end(function(error, response) {
                    expect(usersModel.activate.calledOnce).to.equal(true);
                    expect(usersModel.activate.calledWith({
                        activationToken: 'somerandomtoken'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http status code', function(done) {
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


