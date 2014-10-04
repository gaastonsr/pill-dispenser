var path        = require('path');
var Promise     = require('bluebird');
var Joi         = require('joi');
var bcrypt      = require('bcrypt');
var validations = require(path(__dirname, '..', 'libs', 'validations'));
var UserORM     = require(path(__dirname, '..', 'ORMs', 'UserORM'));

bcrypt = Promise.promisifyAll(bcrypt);

function UsersModel() {

}

UsersModel.prototype = {
    constructor: UsersModel,

    create: function(data) {
        var result = Joi.validate(data, {
            name             : validations.user.name.required(),
            email            : validations.email.required(),
            emailConfirmation: validations.emailConfirmation.required(),
            password         : validations.password.required()
        }, {
            abortEarly: false
        });

        if (result.error) {
            return Promise.reject(validations.formatError(result.error));
        }

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
        }).then(function(hash) {
            return new UserORM({
                name    : data.name,
                email   : data.email,
                password: hash,
                status  : 0
            })
            .save();
        })
        .then(function(model) {
            return model.toJSON();
        });
    },

    activate: function(data) {

    }
};

module.exports = UsersModel;
