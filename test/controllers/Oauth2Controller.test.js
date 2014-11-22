'use strict';

var sinon            = require('sinon');
var sinonAsPromised  = require('sinon-as-promised');
var express          = require('express');
var bodyParser       = require('body-parser');
var request          = require('supertest');
var chai             = require('chai');
var SessionsModel    = require('./../../models/SessionsModel');
var Oauth2Controller = require('./../../controllers/Oauth2Controller');

var expect           = chai.expect;
var sessionsModel    = sinon.createStubInstance(SessionsModel);
var oauth2Controller = new Oauth2Controller(sessionsModel);

/* FAKE SERVER STUFF */
var app    = express();
var router = express.Router();

router.post('/oauth2/authorization', oauth2Controller.getToken);

app.use(bodyParser.json());
app.use(router);
/* FAKE SERVER STUFF */

chai.use(require('chai-things'));

describe('Oauth2Controller', function() {

    describe('#getToken - when a token is requested', function() {
        beforeEach(function() {
            sessionsModel.createFromClientCredentials.reset();
        });

        describe('and the grant type is not allowed', function() {
            it('should return GrantTypeNotAllowed error', function(done) {
                request(app)
                .post('/oauth2/authorization?grant_type=')
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('GrantTypeNotAllowed');
                    expect(body.error.message).to.be.a('string');

                    done();
                });
            });
        });

        describe('and the grant type is client credentials', function() {
            describe('and the required fields are not sent', function() {
                it('should return ValidationError error', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({})
                    .end(function(error, response) {
                        var body = response.body;

                        expect(response.status).to.equal(400);
                        expect(body.error.code).to.equal(response.status);
                        expect(body.error.name).to.equal('ValidationError');
                        expect(body.error.message).to.be.a('string');
                        expect(body.error.errors).to.contain.a.thing.with.property('location', 'email');
                        expect(body.error.errors).to.contain.a.thing.with.property('location', 'password');

                        done();
                    });
                });
            });

            describe('and the credentials are invalid', function() {
                before(function() {
                    var error  = new Error('Email and/or password are incorrect');
                    error.name = 'InvalidCredentials';
                    sessionsModel.createFromClientCredentials.rejects(error);
                });

                it('should return InvalidCredentials error', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({
                        email   : 'john@doe.com',
                        password: 'password'
                    })
                    .end(function(error, response) {
                        var body = response.body;

                        expect(response.status).to.equal(401);
                        expect(body.error.code).to.equal(response.status);
                        expect(body.error.name).to.equal('InvalidCredentials');
                        expect(body.error.message).to.be.a('string');

                        done();
                    });
                });
            });

            describe('and the user is inactive', function() {
                before(function() {
                    var error  = new Error('User account is inactive');
                    error.name = 'InactiveUser';
                    sessionsModel.createFromClientCredentials.rejects(error);
                });

                it('should return InactiveUser error', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({
                        email   : 'john@doe.com',
                        password: 'password'
                    })
                    .end(function(error, response) {
                        var body = response.body;

                        expect(response.status).to.equal(403);
                        expect(body.error.code).to.equal(response.status);
                        expect(body.error.name).to.equal('InactiveUser');
                        expect(body.error.message).to.be.a('string');

                        done();
                    });
                });
            });

            describe('and an unknown error happens', function() {
                before(function() {
                    var error  = new Error('unknown error');
                    error.name = 'UnknownError';
                    sessionsModel.createFromClientCredentials.rejects(error);
                });

                it('should return http status code 500', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({
                        email   : 'john@doe.com',
                        password: 'password'
                    })
                    .end(function(error, response) {
                        expect(response.status).to.equal(500);
                        done();
                    });
                });
            });

            describe('and the data is fine', function() {
                before(function() {
                    sessionsModel.createFromClientCredentials.resolves({
                        id       : 1000,
                        userId   : 1,
                        createdAt: new Date(),
                        authToken: 'somerandomtoken'
                    });
                });

                it('should call sesionsModel.createFromClientCredentials with the right arguments', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({
                        email   : 'john@doe.com',
                        password: 'password'
                    })
                    .end(function(error, response) {
                        expect(sessionsModel.createFromClientCredentials.calledOnce).to.equal(true);
                        expect(sessionsModel.createFromClientCredentials.calledWith({
                            email   : 'john@doe.com',
                            password: 'password'
                        })).to.equal(true);

                        done();
                    });

                });

                it('should return a token', function(done) {
                    request(app)
                    .post('/oauth2/authorization?grant_type=client_credentials')
                    .send({
                        email   : 'john@doe.com',
                        password: 'password'
                    })
                    .end(function(error, response) {
                        expect(response.status).to.equal(201);
                        done();
                    });
                });
            });
        });
    });

});

