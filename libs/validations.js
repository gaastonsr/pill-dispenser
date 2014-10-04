var Joi = require('joi');

var customOptions = {
    emailConfirmation: {
        language: {
            any: {
                allowOnly: 'must match email'
            }
        }
    },
    passwordConfirmation: {
        language: {
            any: {
                allowOnly: 'must match password'
            }
        }
    }
};

var validations = {
    email               : Joi.string().email().strict(),
    emailConfirmation   : Joi.any().valid(Joi.ref('email')).options(customOptions.emailConfirmation),
    password            : Joi.string().min(6).max(50).strict(),
    passwordConfirmation: Joi.any().valid(Joi.ref('password')).options(customOptions.passwordConfirmation),
    token               : Joi.string().strict(),
    id                  : Joi.number().integer().min(1).strict(),
    user: {
        name: Joi.string().max(20).strict()
    },
    device: {
        name      : Joi.string().max(20).strict(),
        identifier: Joi.string().length(32).strict()
    }
};

validations.formatError = function(error) {
    var formattedError    = new Error('Validation error');
    formattedError.name   = 'ValidationError';
    formattedError.errors = [];

    for (var i = 0; i < error.details.length; i++) {
        var detail = error.details[i];
        formattedError.errors.push({
            location: detail.path,
            message : detail.message
        });
    }

    return formattedError;
};

module.exports = validations;
