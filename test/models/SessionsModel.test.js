'use strict';

var Promise       = require('bluebird');
var chai          = require('chai');
var jwt           = require('jwt-simple');
var testData      = require('./data/SessionsModel.test');
var TestsHelper   = require('./../support/TestsHelper');
var config        = require('./../../config');
var SessionsModel = require('./../../models/SessionsModel');
var SessionORM    = require('./../../ORMs/SessionORM');

var expect        = chai.expect;
var testsHelper   = new TestsHelper();
var sessionsModel = new SessionsModel();

describe('SessionsModel', function() {

    describe('#createFromClientCredentials - when a session is created', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.createFromClientCredentials);
        });

        describe('and no user with that email address exists', function() {
            it('should return InvalidCredentials error', function() {
                return sessionsModel.createFromClientCredentials({
                    email   : 'notexistent@example.com',
                    password: 'password'
                })
                .then(function() {
                    Promise.reject(new Error('Creation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidCredentials');
                });
            });
        });

        describe('and its password is incorrect', function() {
            it('should return InvalidCredentials error', function() {
                return sessionsModel.createFromClientCredentials({
                    email   : 'john@doe.com',
                    password: 'notthepassword'
                })
                .then(function() {
                    Promise.reject(new Error('Creation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidCredentials');
                });
            });
        });

        describe('and the user is inactive', function() {
            it('should return InactiveUser error', function() {
                return sessionsModel.createFromClientCredentials({
                    email   : 'jane@doe.com',
                    password: 'password'
                })
                .then(function() {
                    Promise.reject(new Error('Creation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InactiveUser');
                });
            });
        });

        describe('and the data is fine', function() {
            var data = {
                email   : 'john@doe.com',
                password: 'password'
            };

            it('should save a row in the database', function() {
                return sessionsModel.createFromClientCredentials(data)
                .then(function(session) {
                    return new SessionORM({
                        id: session.id
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.be.a('number');
                        expect(model.get('userId')).to.equal(1);
                        expect(model.get('createdAt')).to.be.instanceof(Date);
                    });
                });
            });

            it('should return an auth token', function() {
                return sessionsModel.createFromClientCredentials(data)
                .then(function(session) {
                    expect(session.authToken).to.be.a('string');
                });
            });
        });
    });

    describe('#getByAuthToken - when a session is retrieved by authentication token', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.getByAuthToken);
        });

        describe('and the token is invalid', function() {
            it('should return InvalidToken error', function() {
                return sessionsModel.getByAuthToken({
                    authToken: 'sfnklsdnlkfsdnklf'
                })
                .then(function() {
                    return Promise.reject('Retrieving should fail');
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an invalid type', function() {
            it('should return InvalidToken error', function() {
                var authToken = jwt.encode({
                    sessionId: 1,
                    type     : 'invalid',
                }, config.secret);

                return sessionsModel.getByAuthToken({
                    authToken: authToken
                })
                .then(function() {
                    return Promise.reject('Retrieving should fail');
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an expired session id', function() {
            it('should return ExpiredSession error', function() {
                var authToken = jwt.encode({
                    sessionId: 1000000,
                    type     : 'auth',
                }, config.secret);

                return sessionsModel.getByAuthToken({
                    authToken: authToken
                })
                .then(function() {
                    return Promise.reject('Retrieving should fail');
                })
                .error(function(error) {
                    expect(error.name).to.equal('ExpiredSession');
                });
            });
        });

        describe('and the token contains a valid session id', function() {
            it('should return a user', function() {
                var authToken = jwt.encode({
                    sessionId: 1,
                    type     : 'auth',
                }, config.secret);

                return sessionsModel.getByAuthToken({
                    authToken: authToken
                })
                .then(function(user) {
                    expect(user.userId).to.equal(1);
                });
            });
        });
    });

});
