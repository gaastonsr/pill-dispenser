var express = require('express');
var router  = express.Router({
    caseSensitive: false,
    strict: true
})

// OAuth2
router.post('/oauth2/authorization', oauth2Controller.authorization);

// // Users
// app.post('/users',                 usersController.create);
// app.put( '/users/activate/:token', usersController.activate);

// // Profile
// app.get( '/profile');
// app.put( '/profile');
// app.post('/profile/email-update-request');
// app.put( '/profile/email');
// app.put( '/profile/password');

// // Devices
// app.post('/devices');
// app.put( '/devices/:id/password');

// // User Devices
// app.get(   '/my-devices');
// app.post(  '/my-devices');
// app.delete('/my-devices/:id');

// // Device Settings


module.exports = router;
