'use strict';

var Promise     = require('bluebird');
var chai        = require('chai');
var jwt         = require('jwt-simple');
var bcrypt      = require('bcrypt');
var testData    = require('./data/UsersModel.test');
var TestsHelper = require('./../support/TestsHelper');
var config      = require('./../../config');
var UsersModel  = require('./../../models/UsersModel');
var UserORM     = require('./../../ORMs/UserORM');

var expect = chai.expect;
chai.use(require('chai-things'));

bcrypt = Promise.promisifyAll(bcrypt);

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
            describe('and the email is in uppercase', function() {
                it('should save the email in lowercase', function() {
                    var data = {
                        name    : 'Jane Doe',
                        email   : 'JANE@DOE.COM',
                        password: 'password'
                    };

                    return usersModel.create(data)
                    .then(function(user) {
                        expect(user.email).to.equal('jane@doe.com');
                    });
                });
            });

            it('should save a row in the database', function() {
                var data = {
                    name    : 'Jane Doe',
                    email   : 'jane@doe.com',
                    password: 'password'
                };

                return usersModel.create(data)
                .then(function(user) {
                    return new UserORM({
                        id: user.id
                    })
                    .fetch()
                    .then(function(model) {
                        expect(model.get('id')).to.be.a('number');
                        expect(model.get('name')).to.equal('Jane Doe');
                        expect(model.get('email')).to.equal('jane@doe.com');
                        expect(model.get('password')).to.be.a('string');
                        expect(model.get('status')).to.equal('0');
                        expect(model.get('updatedAt')).to.be.instanceof(Date);
                        expect(model.get('createdAt')).to.be.instanceof(Date);
                    });
                });
            });

            it('should return an activation token', function() {
                var data = {
                    name    : 'Jane Doe',
                    email   : 'jane@doe.com',
                    password: 'password'
                };

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
                    activationToken: 'sdklnfkl2k3kln43k342klnkn342'
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
                    activationToken: activationToken
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
                    activationToken: activationToken
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
                    activationToken: activationToken
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
                    activationToken: activationToken
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

    describe('#update - when a user is updated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.update);
        });

        describe('and the user does not exist', function() {
            it('should return UserNotFound error', function() {
                return usersModel.update({
                    userId: 1000000,
                    name  : 'JDoe'
                })
                .then(function(user) {
                    return Promise.reject(new Error('Update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('UserNotFound');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should update the user name', function() {
                return usersModel.update({
                    userId: 1,
                    name  : 'JDoe'
                })
                .then(function(user) {
                    return new UserORM({
                        id: 1
                    })
                    .fetch();
                })
                .then(function(model) {
                    expect(model.get('name')).to.equal('JDoe');
                });
            });
        });
    });

    describe('#updatePassword - when a user password is updated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.updatePassword);
        });

        describe('and the user does not exist', function() {
            it('should return UserNotFound error', function() {
                return usersModel.updatePassword({
                    userId         : 1000000,
                    currentPassword: 'password',
                    newPassword    : 'newpassword'
                })
                .then(function(user) {
                    return Promise.reject(new Error('Password update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('UserNotFound');
                });
            });
        });

        describe('and the password is incorret', function() {
            it('should return IncorrectPassword error', function() {
                return usersModel.updatePassword({
                    userId         : 1,
                    currentPassword: 'nottherealone',
                    newPassword    : 'newpassword'
                })
                .then(function(user) {
                    return Promise.reject(new Error('Password update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('IncorrectPassword');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should update the user password', function() {
                return usersModel.updatePassword({
                    userId         : 1,
                    currentPassword: 'password',
                    newPassword    : 'newpassword'
                })
                .then(function(user) {
                    return new UserORM({
                        id: 1
                    })
                    .fetch();
                })
                .then(function(model) {
                    return bcrypt.compareAsync('newpassword', model.get('password'));
                })
                .then(function(areEqual) {
                    expect(areEqual).to.equal(true);
                });
            });
        });
    });

    describe('#requestEmailUpdate - when an email update is requested', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.requestEmailUpdate);
        });

        describe('and the email is equal to your current email', function() {
            it('should return DuplicateEmail error', function() {
                return usersModel.requestEmailUpdate({
                    userId  : 1,
                    newEmail: 'john@doe.com',
                    password: 'password'
                })
                .then(function() {
                    return Promise.reject(new Error('Email update request should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DuplicateEmail');
                });
            });
        });

        describe('and the email is equal to your current email', function() {
            it('should return DuplicateEmail error', function() {
                return usersModel.requestEmailUpdate({
                    userId  : 2,
                    newEmail: 'jdoe@gmail.com',
                    password: 'password'
                })
                .then(function() {
                    return Promise.reject(new Error('Email update request should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DuplicateRequest');
                });
            });
        });

        describe('and the new email is used by another account', function() {
            it('should return DuplicateEmail error', function() {
                return usersModel.requestEmailUpdate({
                    userId  : 1,
                    newEmail: 'jane@doe.com',
                    password: 'password'
                })
                .then(function() {
                    return Promise.reject(new Error('Email update request should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('DuplicateEmail');
                });
            });
        });

        describe('and the password is incorrect', function() {
            it('should return IncorrectPassword error', function() {
                return usersModel.requestEmailUpdate({
                    userId  : 1,
                    newEmail: 'jdoe@gmail.com',
                    password: 'nottherealone'
                })
                .then(function() {
                    return Promise.reject(new Error('Email update request should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('IncorrectPassword');
                });
            });
        });

        describe('and the data is fine', function() {
            var data = {
                userId  : 1,
                newEmail: 'jdoe@gmail.com',
                password: 'password'
            };

            it('should update the user new_email field in the database', function() {
                return usersModel.requestEmailUpdate(data)
                .then(function() {
                    return new UserORM({
                        id: 1
                    })
                    .fetch();
                })
                .then(function(model) {
                    expect(model.get('email')).to.equal('john@doe.com');
                    expect(model.get('newEmail')).to.equal('jdoe@gmail.com');
                });
            });

            it('should return an email update token', function() {
                return usersModel.requestEmailUpdate(data)
                .then(function(user) {
                    expect(user.emailUpdateToken).to.be.a('string');
                });
            });
        });
    });

    describe('#updateEmail - when a user email is updated', function() {
        beforeEach(function() {
            return testsHelper.setUp(testData.updateEmail);
        });

        describe('and the token is invalid', function() {
            it('should return InvalidToken error', function() {
                return usersModel.updateEmail({
                    emailUpdateToken: 'dsfsdfdsfds'
                })
                .then(function() {
                    return Promise.reject(new Error('Email update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an invalid type', function() {
            it('should return InvalidToken error', function() {
                var emailUpdateToken = jwt.encode({
                    userId  : 1,
                    newEmail: 'jdoe@gmail.com',
                    type    : 'invalidtype'
                }, config.secret);

                return usersModel.updateEmail({
                    emailUpdateToken: emailUpdateToken
                })
                .then(function() {
                    return Promise.reject(new Error('Email update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and the token contains an invalid user id', function() {
            it('should return InvalidToken error', function() {
                var emailUpdateToken = jwt.encode({
                    userId  : 10000000,
                    newEmail: 'jdoe@gmail.com',
                    type    : 'emailUpdate'
                }, config.secret);

                return usersModel.updateEmail({
                    emailUpdateToken: emailUpdateToken
                })
                .then(function() {
                    return Promise.reject(new Error('Email update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('InvalidToken');
                });
            });
        });

        describe('and no email update request exists', function() {
            it('should return ExpiredEmailUpdateRequest error', function() {
                var emailUpdateToken = jwt.encode({
                    userId  : 1,
                    newEmail: 'jdoe@gmail.com',
                    type    : 'emailUpdate'
                }, config.secret);

                return usersModel.updateEmail({
                    emailUpdateToken: emailUpdateToken
                })
                .then(function() {
                    return Promise.reject(new Error('Email update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('ExpiredEmailUpdateRequest');
                });
            });
        });

        describe('and the last email update request is not equal to the token\'s new email', function() {
            it('should return ExpiredEmailUpdateRequest error', function() {
                var emailUpdateToken = jwt.encode({
                    userId  : 2,
                    newEmail: 'weird@adresss.com',
                    type    : 'emailUpdate'
                }, config.secret);

                return usersModel.updateEmail({
                    emailUpdateToken: emailUpdateToken
                })
                .then(function() {
                    return Promise.reject(new Error('Email update should fail'));
                })
                .error(function(error) {
                    expect(error.name).to.equal('ExpiredEmailUpdateRequest');
                });
            });
        });

        describe('and the data is fine', function() {
            it('should set the user email to the token new email and new_email to null', function() {
                var emailUpdateToken = jwt.encode({
                    userId  : 3,
                    newEmail: 'me@alice.com',
                    type    : 'emailUpdate'
                }, config.secret);

                return usersModel.updateEmail({
                    emailUpdateToken: emailUpdateToken
                })
                .then(function() {
                    return new UserORM({
                        id: 3
                    })
                    .fetch();
                })
                .then(function(model) {
                    expect(model.get('email')).to.equal('me@alice.com');
                    expect(model.get('newEmail')).to.equal(null);
                });
            });
        });
    });

});
