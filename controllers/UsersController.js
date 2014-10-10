var Joi         = require('joi');
var validations = require(path.join(__dirname, '..', 'libs', 'validations'));

function UsersController() {
}

UsersController.prototype = {
    constructor: UsersController,

    create: function(request, response, next) {
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
    },

    activate: function(request, response, next) {
    }
};

module.exports = UsersController;
