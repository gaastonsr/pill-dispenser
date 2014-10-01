var Joi = require('joi');

var validations = {
    email   : Joi.string().email().strict(),
    password: Joi.string().min(6).max(50).strict(),
    token   : Joi.string().strict(),
    id      : Joi.number().integer().min(1).strict(),
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
