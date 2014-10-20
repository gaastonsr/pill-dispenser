'use strict';

module.exports = function(error, request, response, next) {
    var log = '';

    log =  'Date: ' + new Date() + '\n';
    log += 'Url:  ' + request.protocol + '://' + request.get('host') + request.originalUrl + '\n';
    log += error.stack + '\n';
    log += '----------\n';

    console.log(log);

    var jsonResponse = {
        error: {
            code   : 500,
            name   : 'InternalServerError',
            message: 'Internal Server Error'
        }
    };

    response.status(jsonResponse.error.code).json(jsonResponse);
};
