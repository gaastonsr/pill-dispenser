'use strict';

module.exports = function(request, response, next) {
    var jsonResponse = {
        'error': {
            code   : 404,
            name   : 'NotFound',
            message: 'Not Found'
        }
    };

    return response.status(jsonResponse.error.code).json(jsonResponse);
};
