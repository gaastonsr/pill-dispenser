'use strict';

var _       = require('underscore');
var express = require('express');

var UsersModel    = require(__dirname + '/models/UsersModel');
var SessionsModel = require(__dirname + '/models/SessionsModel');

var usersModel    = new UsersModel();
var sessionsModel = new SessionsModel();

var UsersController     = require('./controllers/UsersController');
var Oauth2Controller    = require('./controllers/Oauth2Controller');
var ProfileController   = require('./controllers/ProfileController');
var DevicesController   = require('./controllers/DevicesController');
var MyDevicesController = require('./controllers/MyDevicesController');

var usersController     = new UsersController(usersModel);
var oauth2Controller    = new Oauth2Controller(sessionsModel);
var profileController   = new ProfileController(usersModel);
var devicesController   = new DevicesController();
var myDevicesController = new MyDevicesController();

// bind controllers functions context to themselves
_.bindAll.apply(_, [usersController].concat(_.functions(usersController)));
_.bindAll.apply(_, [oauth2Controller].concat(_.functions(oauth2Controller)));
_.bindAll.apply(_, [profileController].concat(_.functions(profileController)));
_.bindAll.apply(_, [devicesController].concat(_.functions(devicesController)));
_.bindAll.apply(_, [myDevicesController].concat(_.functions(myDevicesController)));

var sessionChecker = require('./middlewares/sessionChecker');
var checkSession   = sessionChecker(sessionsModel);

var router = express.Router({
    caseSensitive: false,
    strict       : true
});

// Users
router.post('/users',                 usersController.create);
router.put( '/users/activate/:token', usersController.activate);

// OAuth2
router.post('/oauth2/authorization', oauth2Controller.authorization);

// Profile
router.get( '/profile',                      checkSession, profileController.get);
router.put( '/profile',                      checkSession, profileController.update);
router.put( '/profile/password',             checkSession, profileController.updatePassword);
router.post('/profile/email-update-request', checkSession, profileController.requestEmailUpdate);
router.put( '/profile/email/:token'        , profileController.updateEmail);

// // Devices
// router.post('/devices');
// router.put( '/devices/:id/password');

// // User Devices
// router.get(   '/my-devices');
// router.post(  '/my-devices');
// router.delete('/my-devices/:id');

module.exports = router;
