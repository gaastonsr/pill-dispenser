var path    = require('path');
var _       = require('underscore');
var express = require('express');

var UsersController     = require(path.join(__dirname, 'controllers', 'UsersController'));
var Oauth2Controller    = require(path.join(__dirname, 'controllers', 'Oauth2Controller'));
var ProfileController   = require(path.join(__dirname, 'controllers', 'ProfileController'));
var DevicesController   = require(path.join(__dirname, 'controllers', 'DevicesController'));
var MyDevicesController = require(path.join(__dirname, 'controllers', 'MyDevicesController'));

var usersController     = new UsersController();
var oauth2Controller    = new Oauth2Controller();
var profileController   = new Oauth2Controller();
var devicesController   = new DevicesController();
var myDevicesController = new MyDevicesController();

// bind controllers functions context to themselves
_.bindAll.apply(_, [usersController].concat(_.functions(usersController)));
_.bindAll.apply(_, [oauth2Controller].concat(_.functions(oauth2Controller)));
_.bindAll.apply(_, [profileController].concat(_.functions(profileController)));
_.bindAll.apply(_, [devicesController].concat(_.functions(devicesController)));
_.bindAll.apply(_, [myDevicesController].concat(_.functions(myDevicesController)));

var router = express.Router({
    caseSensitive: false,
    strict: true
});

// Users
router.post('/users',                 usersController.create);
router.put( '/users/activate/:token', usersController.activate);

// // OAuth2
// router.post('/oauth2/authorization', oauth2Controller.authorization);

// // Profile
// router.get( '/profile');
// router.put( '/profile');
// router.post('/profile/email-update-request');
// router.put( '/profile/email');
// router.put( '/profile/password');

// // Devices
// router.post('/devices');
// router.put( '/devices/:id/password');

// // User Devices
// router.get(   '/my-devices');
// router.post(  '/my-devices');
// router.delete('/my-devices/:id');

// // Device Settings


module.exports = router;
