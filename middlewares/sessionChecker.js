'use strict';

module.exports = function(sessionsModel) {
    return function(request, response, next) {
        var jsonResponse = {};
        var authToken    = getToken(request.headers);

        if (authToken === '') {
            jsonResponse.error = {
                code   : 401,
                name   : 'TokenNotFound',
                message: 'Token not found'
            };

            return response.status(jsonResponse.error.code).json(jsonResponse);
        }

        sessionsModel.getByAuthToken({
            authToken: authToken
        })
        .then(function(session) {
            request.user = {
                id: session.userId
            };

            next();
        })
        .error(function(error) {
            if (error.name === 'InvalidToken' || error.name === 'ExpiredSession') {
                jsonResponse.error = {
                    code   : 401,
                    name   : error.name,
                    message: error.message
                };

                return response.status(jsonResponse.error.code).json(jsonResponse);
            }

            return next(error);
        });
    };
};

function getToken(headers) {
    var token      = '';
    var authHeader = headers.authorization;

    if (authHeader && /^Bearer /i.test(authHeader)) {
        var index = authHeader.indexOf(' ');
        token     = authHeader.substring(index + 1).trim();
    }

    return token;
}
