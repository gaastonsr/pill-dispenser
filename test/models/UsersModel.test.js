var Promise     = require('bluebird');
var chai        = require('chai');
var jwt         = require('jwt-simple');
var testData    = require('./data/UsersModel.test');
var TestsHelper = require('./../support/TestsHelper');
var config      = require('./../../config');
var UsersModel  = require('./../../models/UsersModel');
var UserORM     = require('./../../ORMs/UserORM');

var expect = chai.expect;
chai.use(require('chai-things'));

var testsHelper = new TestsHelper();
var usersModel  = new UsersModel();

describe('UsersModel', function() {

    describe('#create - when a user is created', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.create);
        });

        describe('and a user with the same email exists', function() {
            it('should return DuplicateEmail error', function() {
                return usersModel.create({
                    name    : 'John Doe',
                    email   : 'john@doe.com',
                    password: 'password'
                })
                .then(function() {
                    Promise.reject(new Error('Creation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DuplicateEmail');
                });
            });
        });

        describe('and the data is fine', function() {
            var data = {
                name    : 'Jane Doe',
                email   : 'jane@doe.com',
                password: 'password'
            };

            it('should save a row in the database', function() {
                return usersModel.create(data)
                .then(function(user) {
                    return new UserORM({
                        id: user.id
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.be.a('number');
                        expect(model.get('name')).to.equal('Jane Doe');
                        expect(model.get('password')).to.be.a('string');
                        expect(model.get('status')).to.equal('0');
                        expect(model.get('updatedAt')).to.be.instanceof(Date);
                        expect(model.get('createdAt')).to.be.instanceof(Date);
                    });
                });
            });

            it('should return an activation token', function() {
                return usersModel.create(data)
                .then(function(user) {
                    expect(user.activationToken).to.be.a('string');
                });
            });
        });
    });

    describe('#activate - when a user is actived', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.activate);
        });

        describe('and the token is invalid', function() {
            it('should return InvalidToken error', function() {
                return usersModel.activate({
                    token: 'sdklnfkl2k3kln43k342klnkn342'
                })
                .then(function(user) {
                    return Promise.reject(new Error('Activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an invalid type', function() {
            it('should return InvalidToken error', function() {
                var activationToken = jwt.encode({
                    userId: 2,
                    type  : 'auth'
                }, config.secret);

                return usersModel.activate({
                    token: activationToken
                })
                .then(function(user) {
                    return Promise.reject(new Error('Activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an invalid user id', function() {
            it('should return InvalidToken error', function() {
                var activationToken = jwt.encode({
                    userId: 10000000,
                    type  : 'activation'
                }, config.secret);

                return usersModel.activate({
                    token: activationToken
                })
                .then(function(user) {
                    return Promise.reject(new Error('Activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the user is already active', function() {
            it('should return UserAlreadyActive error', function() {
                var activationToken = jwt.encode({
                    userId: 1,
                    type  : 'activation'
                }, config.secret);

                return usersModel.activate({
                    token: activationToken
                })
                .then(function(user) {
                    return Promise.reject(new Error('Activation should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('UserAlreadyActive');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should return the user data', function() {
                var activationToken = jwt.encode({
                    userId: 2,
                    type  : 'activation'
                }, config.secret);

                return usersModel.activate({
                    token: activationToken
                })
                .then(function(user) {
                    expect(user.id).to.equal(2);
                    expect(user.name).to.equal('Jane Doe');
                    expect(user.email).to.equal('jane@doe.com');
                    expect(user.status).to.equal('1');
                });
            });
        });
    });

});
