'use strict';

var Joi = require('joi');

var customOptions = {
    time: {
        language: {
            date: {
                base: 'must be a valid time string with HH:mm format'
            }
        }
    }
};

var validations = {
    email       : Joi.string().email().strict(),
    password    : Joi.string().min(6).max(50).strict(),
    token       : Joi.string().strict(),
    id          : Joi.number().integer().min(1).strict(),
    medicineName: Joi.string().max(20).strict(),
    time        : Joi.date().format('HH:mm').options(customOptions.time),
    user: {
        name: Joi.string().max(20).strict()
    },
    device: {
        name      : Joi.string().max(20).strict(),
        identifier: Joi.string().length(36).strict()
    },
    matches: function(field, customErrorMessage) {
        var errorMessage = customErrorMessage || 'must match ' + field;

        return Joi.any().valid(Joi.ref(field)).options({
            language: {
                any: {
                    allowOnly: errorMessage
                }
            }
        });
    }
};

validations.schedule = Joi.array().includes(validations.time).unique();

module.exports = validations;
