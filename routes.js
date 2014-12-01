'use strict';

var express = require('express');
var config  = require('config');
var Mailer  = require('./libs/Mailer');

var mailer = new Mailer(config.get('mail'));

var UsersModel     = require('./models/UsersModel');
var SessionsModel  = require('./models/SessionsModel');
var DevicesModel   = require('./models/DevicesModel');
var MyDevicesModel = require('./models/MyDevicesModel');

var usersModel     = new UsersModel();
var sessionsModel  = new SessionsModel();
var devicesModel   = new DevicesModel();
var myDevicesModel = new MyDevicesModel();

var UsersController     = require('./controllers/UsersController');
var Oauth2Controller    = require('./controllers/Oauth2Controller');
var ProfileController   = require('./controllers/ProfileController');
var DevicesController   = require('./controllers/DevicesController');
var MyDevicesController = require('./controllers/MyDevicesController');

var usersController     = new UsersController(mailer, usersModel);
var oauth2Controller    = new Oauth2Controller(sessionsModel);
var profileController   = new ProfileController(mailer, usersModel);
var devicesController   = new DevicesController(devicesModel);
var myDevicesController = new MyDevicesController(myDevicesModel);

var sessionChecker = require('./middlewares/sessionChecker');
var checkSession   = sessionChecker(sessionsModel);

var router = express.Router({
    caseSensitive: false,
    strict       : true
});

// Users
router.post('/users'                , usersController.create);
router.put( '/users/activate/:token', usersController.activate);

// OAuth2
router.post('/oauth2/authorization', oauth2Controller.getToken);

// Profile
router.get( '/profile'                     , checkSession, profileController.get);
router.put( '/profile'                     , checkSession, profileController.update);
router.put( '/profile/password'            , checkSession, profileController.updatePassword);
router.post('/profile/email-update-request', checkSession, profileController.requestEmailUpdate);
router.put( '/profile/email/:token'        , profileController.updateEmail);

// Devices
router.post(  '/devices'          , checkSession, devicesController.register);
router.delete('/devices/:deviceId', checkSession, devicesController.delete);

// User Devices
router.post(  '/my-devices'                                          , checkSession, myDevicesController.link);
router.get(   '/my-devices'                                          , checkSession, myDevicesController.list);
router.delete('/my-devices/:linkageId'                               , checkSession, myDevicesController.unlink);
router.put(   '/my-devices/:linkageId/password'                      , checkSession, myDevicesController.updatePassword);
router.put(   '/my-devices/:linkageId/name'                          , checkSession, myDevicesController.updateName);
router.post(  '/my-devices/:linkageId/settings'                      , checkSession, myDevicesController.addSetting);
router.get(   '/my-devices/:linkageId/settings'                      , checkSession, myDevicesController.getSettings);
router.put(   '/my-devices/:linkageId/settings/:settingId/activate'  , checkSession, myDevicesController.activateSetting);
router.put(   '/my-devices/:linkageId/settings/:settingId/deactivate', checkSession, myDevicesController.deactivateSetting);
router.delete('/my-devices/:linkageId/settings/:settingId'           , checkSession, myDevicesController.deleteSetting);

// Prototype
router.get('/config', myDevicesController.config);

module.exports = router;
