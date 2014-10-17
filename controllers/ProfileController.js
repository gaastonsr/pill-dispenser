function ProfileController() {

}

ProfileController.prototype = {
    constructor: ProfileController,

    get: function(request, response, next) {
        var user = request.user;
        var jsonResponse = {
            data: {
                kind     : 'UserProfile',
                id       : user.id,
                name     : user.name,
                email    : user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            }
        };

        return response.status(200).json(jsonResponse);
    },

    update: function() {

    },

    updatePassword: function() {

    },

    requestEmailUpdate: function() {

    },

    updateEmail: function() {

    }
};

module.exports = ProfileController;
