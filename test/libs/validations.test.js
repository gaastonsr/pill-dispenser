'use strict';

var Joi         = require('joi');
var chai        = require('chai');
var _           = require('underscore');
    _.str       = require('underscore.string');
var validations = require('./../../libs/validations');

var expect = chai.expect;
chai.use(require('chai-things'));

describe('validations', function() {

    // validation
    describe('email', function() {
        var schema    = validations.email.required();
        var maxLength = 254;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer than ' + maxLength + ' chars', function() {
            var value = _.str.repeat('a', maxLength + 1);
            var errorMessage = 'value must be a valid email';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when bad format', function() {
            var value = 'novalidformat';
            var errorMessage = 'value must be a valid email';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'im@good.format';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('password', function() {
        var schema    = validations.password.required();
        var minLength = 6;
        var maxLength = 50;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when shorter than ' + minLength + ' characters', function() {
            var value = _.str.repeat('a', minLength - 1);
            var errorMessage = 'value length must be at least ' + minLength + ' characters long';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer than ' + maxLength + ' characters', function() {
            var value = _.str.repeat('a', maxLength + 1);
            var errorMessage = 'value length must be less than or equal to ' + maxLength + ' characters long';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'goodpassword';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('user.name', function() {
        var schema    = validations.user.name.required();
        var maxLength = 20;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer than ' + maxLength + ' characters', function() {
            var value = _.str.repeat('a', maxLength + 1);
            var errorMessage = 'value length must be less than or equal to ' + maxLength + ' characters long';

            it('It should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'John';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('device.name', function() {
        var schema    = validations.device.name.required();
        var maxLength = 20;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer than ' + maxLength + ' characters', function() {
            var value = _.str.repeat('a', maxLength + 1);
            var errorMessage = 'value length must be less than or equal to ' + maxLength + ' characters long';

            it('It should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'John';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('device.identifier', function() {
        var schema = validations.device.identifier.required();
        var length = 36;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when is not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer or shorter than ' + length + ' characters long', function() {
            var values = [_.str.repeat('a', length - 1), _.str.repeat('a', length + 1)];
            var errorMessage = 'value length must be ' + length + ' characters long';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when exactly ' + length + ' characters long', function() {
            var value = _.str.repeat('a', length);

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('token', function() {
        var schema = validations.token.required();

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'token';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('id', function() {
        var schema = validations.id.required();

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a number', function() {
            var values = ['', null, true, {}, []];
            var errorMessage = 'value must be a number';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when not an integer', function() {
            var value = 1.1;
            var errorMessage = 'value must be an integer';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when less than 1', function() {
            var value = 0;
            var errorMessage = 'value must be larger than or equal to 1';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when NaN', function() {
            var value = NaN;
            var errorMessage = 'value must be a number';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when Infinity', function() {
            var value = Infinity;
            var errorMessage = 'value must be an integer';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 1;

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('medicineName', function() {
        var schema    = validations.medicineName.required();
        var maxLength = 20;

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a string';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value is not allowed to be empty';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when longer than ' + maxLength + ' characters', function() {
            var value = _.str.repeat('a', maxLength + 1);
            var errorMessage = 'value length must be less than or equal to ' + maxLength + ' characters long';

            it('It should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = 'John';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('time', function() {
        var schema = validations.time.required();

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not a string', function() {
            var values = [1, null, true, {}, []];
            var errorMessage = 'value must be a valid time string with HH:mm format';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when empty', function() {
            var value = '';
            var errorMessage = 'value must be a valid time string with HH:mm format';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not valid format', function() {
            var value = '08:00:00';
            var errorMessage = 'value must be a valid time string with HH:mm format';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(value, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when good format', function() {
            var value = '08:00';

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('schedule', function() {
        var schema = validations.schedule.required();

        describe('when undefined', function() {
            var errorMessage = 'value is required';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate(void 0, schema);
                expect(result.error.message).to.equal(errorMessage);
            });
        });

        describe('when not an array', function() {
            var values = [1, null, true, {}, 'string'];
            var errorMessage = 'value must be an array';

            it('should return "' + errorMessage + '"', function() {
                for (var i = 0; i < values.length; i++) {
                    var value  = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        // describe('when repeated values', function() {
        //     var value = ['08:00', '08:00'];
        //     var errorMessage = 'position 2 contains a duplicate value';

        //     it('should return "' + errorMessage + '"', function() {
        //         var result = Joi.validate(value, schema);
        //         expect(result.error.message).to.equal(errorMessage);
        //     });
        // });

        describe('when empty', function() {
            var value = [];

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });

        describe('when contains valid values', function() {
            var value = ['08:00', '16:00'];

            it('should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.equal(null);
            });
        });
    });


    // validation
    describe('matches', function() {
        var schema = {
            email            : validations.email.required(),
            emailConfirmation: validations.matches('email').required()
        };

        describe('when different', function() {
            var errorMessage = 'emailConfirmation must match email';

            it('should return "' + errorMessage + '"', function() {
                var result = Joi.validate({
                    email            : 'john@doe.com',
                    emailConfirmation: 'notthesame'
                }, schema);

                expect(result.error.details).contain.a.thing.with
                .property('message', errorMessage);
            });
        });

        describe('when the same', function() {
            it('should return no error', function() {
                var result = Joi.validate({
                    email            : 'john@doe.com',
                    emailConfirmation: 'john@doe.com'
                }, schema);

                expect(result.error).to.equal(null);
            });
        });
    });

});
