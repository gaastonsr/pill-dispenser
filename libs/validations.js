var Joi = require('joi');

var validations = {
    email   : Joi.string().email(),
    password: Joi.string().min(6).max(50),
    user: {
        name: Joi.string().max(20)
    },
    device: {
        name      : Joi.string().max(20),
        identifier: Joi.string().length(32)
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
