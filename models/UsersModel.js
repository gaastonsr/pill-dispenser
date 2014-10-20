'use strict';

var Promise   = require('bluebird');
var bcrypt    = require('bcrypt');
var jwt       = require('jwt-simple');
var bookshelf = require('./../bookshelf');
var config    = require('./../config');
var UserORM   = require('./../ORMs/UserORM');

bcrypt = Promise.promisifyAll(bcrypt);

function UsersModel() {

}

UsersModel.prototype = {
    constructor: UsersModel,

    create: function(data) {
        var email = data.email.toLowerCase();
        var error = null;

        return new UserORM({
            email: email
        })
        .fetch()
        .then(function(model) {
            if (model) {
                error      = new Error('We already have a user registered with that email');
                error.name = 'DuplicateEmail';
                return Promise.reject(error);
            }

            return bcrypt.hashAsync(data.password, 10);
        })
        .then(function(hash) {
            return new UserORM({
                name    : data.name,
                email   : email,
                password: hash,
                status  : '0'
            })
            .save();
        })
        .then(function(model) {
            var user = model.toJSON();

            user.activationToken = jwt.encode({
                userId: user.id,
                type  : 'activation'
            }, config.secret);

            return user;
        });
    },

    activate: function(data) {
        var decoded = null;
        var error   = null;

        try {
            decoded = jwt.decode(data.activationToken, config.secret);
        } catch (caughtError) {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        if (decoded.type !== 'activation') {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        return new UserORM({
            id: decoded.userId
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                error      = new Error('Invalid token');
                error.name = 'InvalidToken';
                return Promise.reject(error);
            }

            if (model.get('status') === '1') {
                error      = new Error('User already active');
                error.name = 'UserAlreadyActive';
                return Promise.reject(error);
            }

            return model.save({
                status: '1'
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    update: function(data) {
        var error = null;

        return new UserORM({
            id: data.userId
        })
        .fetch()
        .then(function(model) {
            if (!model) { // double check, should never happen
                error      = new Error('User not found');
                error.name = 'UserNotFound';
                return Promise.reject(error);
            }

            return model.save({
                name: data.name
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    updatePassword: function(data) {
        var userModel = null;
        var error     = null;

        return new UserORM({
            id: data.userId
        })
        .fetch()
        .then(function(model) {
            if (!model) { // double check, should never happen
                error      = new Error('User not found');
                error.name = 'UserNotFound';
                return Promise.reject(error);
            }

            userModel = model;

            return bcrypt.compareAsync(data.currentPassword, model.get('password'));
        })
        .then(function(areEqual) {
            if (!areEqual) {
                error      = new Error('Incorrect password');
                error.name = 'IncorrectPassword';
                return Promise.reject(error);
            }

            return bcrypt.hashAsync(data.newPassword, 10);
        })
        .then(function(hash) {
            return userModel.save({
                password: hash
            }, {
                patch: true
            });
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    requestEmailUpdate: function(data) {
        var userModel = null;
        var error     = null;

        return new UserORM({
            id: data.userId
        })
        .fetch()
        .then(function(model) {
            var currentEmail           = model.get('email');
            var lastEmailUpdateRequest = model.get('newEmail');

            if (data.newEmail === currentEmail) {
                error      = new Error('New email is equal to your current email');
                error.name = 'DuplicateEmail';
                return Promise.reject(error);
            }

            if (data.newEmail === lastEmailUpdateRequest) {
                error      = new Error('An email update request for ' + data.newEmail + ' already exists');
                error.name = 'DuplicateRequest';
                return Promise.reject(error);
            }

            userModel = model;

            return new UserORM({
                email: data.newEmail
            })
            .fetch();
        })
        .then(function(model) {
            if (model) {
                error      = new Error('Email already in use by another account');
                error.name = 'DuplicateEmail';
                return Promise.reject(error);
            }

            return bcrypt.compareAsync(data.password, userModel.get('password'));
        })
        .then(function(areEqual) {
            if (!areEqual) {
                error      = new Error('Incorrect password');
                error.name = 'IncorrectPassword';
                return Promise.reject(error);
            }

            return userModel.save({
                newEmail: data.newEmail
            }, {
                patch: true
            });
        })
        .then(function(model) {
            var user = model.toJSON();

            user.emailUpdateToken = jwt.encode({
                userId  : user.id,
                newEmail: data.newEmail,
                type    : 'emailUpdate'
            }, config.secret);

            return user;
        });
    },

    updateEmail: function(data) {
        var decoded = null;
        var error   = null;

        try {
            decoded = jwt.decode(data.emailUpdateToken, config.secret);
        } catch (caughtError) {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        if (decoded.type !== 'emailUpdate') {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        return bookshelf.transaction(function(trx) {
            return new UserORM({
                id: decoded.userId
            })
            .query(function(queryBuilder) {
                queryBuilder.transacting(trx).forUpdate();
            })
            .fetch()
            .then(function(model) {
                if (!model) {
                    error      = new Error('Invalid token');
                    error.name = 'InvalidToken';
                    return Promise.reject(error);
                }

                var lastEmailUpdateRequest = model.get('newEmail');

                if (!lastEmailUpdateRequest || (decoded.newEmail !== lastEmailUpdateRequest)) {
                    error      = new Error('Expired email update request');
                    error.name = 'ExpiredEmailUpdateRequest';
                    return Promise.reject(error);
                }

                return model.save({
                    email   : decoded.newEmail,
                    newEmail: null
                }, {
                    patch      : true,
                    transacting: trx
                });
            });
        })
        .then(function(model) {
            return model.toJSON();
        });
    }
};

module.exports = UsersModel;
