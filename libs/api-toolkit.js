var _ = require('underscore');

var Toolkit = {};

var Controller = Toolkit.Controller = function() {
    // fix route handlers context
    _.bindAll.apply(_, [this].concat(_.functions(this)));

    this.initialize.apply(this, arguments);
};

_.extend(Controller.prototype, {



});

var extend = function(prototypeProperties, staticProperties) {
    var parent = this;
    var child;

    if (prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
        child = prototypeProperties.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    _.extend(child, parent, staticProperties);

    var Surrogate = function() {
        this.constructor = child;
    };

    Surrogate.prototype = parent.prototype;
    child.prototype     = new Surrogate();

    if (prototypeProperties) {
        _.extend(child.prototype, prototypeProperties);
    }

    child.__super__ = parent.prototype;

    return child;
};

Controller.extend = extend;

module.exports = Toolkit;
