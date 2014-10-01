var path        = require('path');
var Joi         = require('joi');
var chai        = require('chai');
var _           = require('underscore');
    _.str       = require('underscore.string');
var validations = require(path.join(__dirname, '..', '..', 'libs', 'validations'));

var expect = chai.expect;

describe('validations', function() {

    //validation
    describe('formatError', function() {
        describe('when passed a Joi error', function() {
            it('should returned a formatted error', function() {
                var result = Joi.validate({}, {
                    email: Joi.string().email().required()
                });

                var formattedError = validations.formatError(result.error);

                expect(formattedError.name).to.equal('ValidationError');
                expect(formattedError.message).to.equal('Validation error');
                expect(formattedError.errors).to.equal([
                    {
                        location: 'email',
                        message : 'value is required'
                    }
                ]);
            });
        });
    });


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
                    var value = values[i];
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
                expect(result.error).to.be.null;
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
                    var value = values[i];
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
                expect(result.error).to.be.null;
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
                    var value = values[i];
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

            it('It should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.be.null;
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
                    var value = values[i];
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

            it('It should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.be.null;
            });
        });
    });


    // validation
    describe('device.identifier', function() {
        var schema = validations.device.identifier.required();
        var length = 32;

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
                    var value = values[i];
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
                    var value = values[i];
                    var result = Joi.validate(value, schema);
                    expect(result.error.message).to.equal(errorMessage);
                }
            });
        });

        describe('when exactly ' + length + ' characters long', function() {
            var value = _.str.repeat('a', length);

            it('It should return no error', function() {
                var result = Joi.validate(value, schema);
                expect(result.error).to.be.null;
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
                    var value = values[i];
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
                expect(result.error).to.be.null;
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
                    var value = values[i];
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
                expect(result.error).to.be.null;
            });
        });
    });
});
