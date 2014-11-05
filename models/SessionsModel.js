'use strict';

var Promise    = require('bluebird');
var bcrypt     = require('bcrypt');
var jwt        = require('jwt-simple');
var config     = require('./../config');
var UserORM    = require('./../ORMs/UserORM');
var SessionORM = require('./../ORMs/SessionORM');
var UserORM    = require('./../ORMs/UserORM');

bcrypt = Promise.promisifyAll(bcrypt);

function SessionsModel() {

}

SessionsModel.prototype = {
    constructor: SessionsModel,

    createFromClientCredentials: function(data) {
        var userModel = null;
        var error     = null;

        return new UserORM({
            email: data.email
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                error      = new Error('Email and/or password are incorrect');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            userModel = model;

            return bcrypt.compareAsync(data.password, model.get('password'));
        })
        .then(function(areEqual) {
            if (!areEqual) {
                error      = new Error('Email and/or password are incorrect');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            if (userModel.get('status') === '0') {
                error      = new Error('InactiveUser');
                error.name = 'InactiveUser';
                return Promise.reject(error);
            }

            return new SessionORM({
                userId: userModel.get('id')
            }).save();
        })
        .then(function(model) {
            var session = model.toJSON();

            session.authToken = jwt.encode({
                sessionId: model.get('id'),
                type     : 'auth'
            }, config.secret);

            return session;
        });
    },

    getByAuthToken: function(data) {
        var decoded = null;
        var error   = null;

        try {
            decoded = jwt.decode(data.authToken, config.secret);
        } catch (caughtError) {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        if (decoded.type !== 'auth') {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        return new SessionORM({
            id: decoded.sessionId
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                var error  = new Error('ExpiredSession');
                error.name = 'ExpiredSession';
                return Promise.reject(error);
            }

            // TODO: if more than x time delete session?
            // or let the cronjob do it?

            return model.toJSON();
        });
    }
};

module.exports = SessionsModel;
