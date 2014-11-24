'use strict';

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
        identifier: Joi.string().length(36).strict()
    }
};

module.exports = validations;
