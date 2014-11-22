'use strict';

var Joi         = require('joi');
var toolkit     = require('./../libs/api-toolkit');
var validations = require('./../libs/validations');

module.exports = toolkit.Controller.extend({

    initialize: function(usersModel) {
        this.usersModel = usersModel;
    },

    register: function(request, response, next) {

    },

    delete: function(request, response, next) {

    }

});
