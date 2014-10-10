var path    = require('path');
var Promise = require('bluebird');
var bcrypt  = require('bcrypt');
var jwt     = require('jwt-simple');
var config  = require(path.join(__dirname, '..', 'config'));
var UserORM = require(path.join(__dirname, '..', 'ORMs', 'UserORM'));

bcrypt = Promise.promisifyAll(bcrypt);

function UsersModel() {
}

UsersModel.prototype = {
    constructor: UsersModel,

    create: function(data) {
        return new UserORM({
            email: data.email
        })
        .fetch()
        .then(function(model) {
            if (model) {
                var error  = new Error('We already have a user registered with that email');
                error.name = 'DuplicateEmail';
                return Promise.reject(error);
            }

            return bcrypt.hashAsync(data.password, 10);
        })
        .then(function(hash) {
            return new UserORM({
                name    : data.name,
                email   : data.email,
                password: hash,
                status  : '0'
            })
            .save();
        })
        .then(function(model) {
            var user = model.toJSON();

            user.activationToken = jwt.encode({
                userId: user.id
            }, config.secret);

            return user;
        });
    },

    activate: function(data) {
        var decoded = null;

        try {
            decoded = jwt.decode(data.token, config.secret);
        } catch (error) {
            var error  = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        return new UserORM({
            id: decoded.userId
        })
        .fetch()
        .then(function(model) {
            if (!model) {
                var error  = new Error('Invalid token');
                error.name = 'InvalidToken';
                return Promise.reject(error);
            }

            if (model.get('status') === '1') {
                var error  = new Error('User already active');
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
    }
};

module.exports = UsersModel;
