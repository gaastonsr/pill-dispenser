var Promise = require('bluebird');

function SessionsModelStub() {

}

SessionsModelStub.prototype = {
    constructor: SessionsModelStub,

    getByAuthToken: function(data) {
        var token = data.authToken;

        if (token === 'invalidtoken') {
            var error  = new Error('Invalid token');
            error.name = 'InvalidToken';
            return Promise.reject(error);
        }

        if (token === 'expiredsession') {
            var error  = new Error('Expired session');
            error.name = 'ExpiredSession';
            return Promise.reject(error);
        }

        if (token === 'servererror') {
            var error  = new Error('Server error');
            error.name = 'ServerError';
            return Promise.reject(error);
        }

        return Promise.resolve({
            id: 1
        });
    }
};

module.exports = SessionsModelStub;
