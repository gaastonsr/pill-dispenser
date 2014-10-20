'use strict';

var Promise = require('bluebird');

function SessionsModelStub() {

}

SessionsModelStub.prototype = {
    constructor: SessionsModelStub,

    getByAuthToken: function(data) {
        var token = data.authToken;
        var error = null;

        if (token === 'invalidtoken') {
            error      = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        if (token === 'expiredsession') {
            error      = new Error('Expired session');
            error.name = 'ExpiredSession';
            return Promise.reject(error);
        }

        if (token === 'servererror') {
            error      = new Error('Server error');
            error.name = 'ServerError';
            return Promise.reject(error);
        }

        return Promise.resolve({
            id    : 1,
            userId: 1
        });
    }
};

module.exports = SessionsModelStub;
