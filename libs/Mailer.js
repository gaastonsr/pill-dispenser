var nodemailer     = require('nodemailer');
var emailTemplates = require('email-templates');
var _              = require('underscore');

function Mailer(options) {
    this.from        = options.from;
    this.transporter = nodemailer.createTransport(options.transport);

    this.initializeTemplater(options.templatesDir);
}

Mailer.prototype = {
    constructor: Mailer,

    initializeTemplater: function(templatesDir) {
        var self = this;

        this.templater = emailTemplates(templatesDir, function(error, templater) {
            self.templater = templater;
        });
    },

    sendMail: function(template, locals, data, callback) {
        var self = this;

        this.templater(template, locals, function(error, html) {
            self.transporter.sendMail(_.extend({
                from: this.from,
                html: html
            }, data), callback);
        });
    }
};

module.exports = Mailer;
