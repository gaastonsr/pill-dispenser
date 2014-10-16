var Promise    = require('bluebird');
var bcrypt     = require('bcrypt');
var jwt        = require('jwt-simple');
var config     = require('./../config');
var UserORM    = require('./../ORMs/UserORM');
var SessionORM = require('./../ORMs/SessionORM');

bcrypt = Promise.promisifyAll(bcrypt);

function SessionsModel() {

}

SessionsModel.prototype = {
    constructor: SessionsModel,

    createFromClientCredentials: function(data) {
        var userModel = null;

        return new UserORM({
            email: data.email
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                var error  = new Error('Invalid credentials');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            userModel = model;

            return bcrypt.compareAsync(data.password, model.get('password'));
        })
        .then(function(areEqual) {
            if (!areEqual) {
                var error  = new Error('Invalid credentials');
                error.name = 'InvalidCredentials';
                return Promise.reject(error);
            }

            if (userModel.get('status') === '0') {
                var error  = new Error('InactiveUser');
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
    }
};

module.exports = SessionsModel;
