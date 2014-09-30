function Oauth2Controller() {

}

Oauth2Controller.prototype = {
    constructor: Oauth2Controller,

    authorization: function(request, response, next) {
        response.status(200).json({ message: 'hola!' });
    }
};

module.exports = Oauth2Controller;
