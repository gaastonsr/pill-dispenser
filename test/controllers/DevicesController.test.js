// 'use strict';

// var Promise           = require('bluebird');
// var sinon             = require('sinon');
// var express           = require('express');
// var bodyParser        = require('body-parser');
// var request           = require('supertest');
// var chai              = require('chai');
// var toolkit           = require('./../../libs/api-toolkit');
// var DevicesModel      = require('./../../models/DevicesModel');
// var DevicesController = require('./../../controllers/DevicesController');

// var expect          = chai.expect;
// var devicesModel      = new DevicesModel();
// var devicesController = new DevicesController(devicesModel);

// /* FAKE SERVER STUFF */
// var app    = express();
// var router = express.Router();

// var checkSession = function(request, response, next) {
//     request.user = {
//         id: 1
//     };

//     next();
// };

// router.post(  '/devices'    , checkSession, devicesController.register);
// router.delete('/devices/:id', checkSession, devicesController.delete);

// app.use(bodyParser.json());
// app.use(toolkit.energizer());
// app.use(router);
// // app.use(function(error, request, response, next) {
// //     console.log(error.stack);
// //     response.status(500).send();
// // });
// /* FAKE SERVER STUFF */

// chai.use(require('chai-things'));

// describe('DevicesController', function() {

//     describe('#register - when a device is registered', function() {
//         describe('and an unknown error happens', function() {
//             it('should return 500 http code', function(done) {
//             });
//         });

//         describe('and everything is fine', function() {
//             it('should call model.method with the right arguments', function(done) {
//             });

//             it('should return the device created', function(done) {

//             });
//         });
//     });

//     describe('#delete - when a device is deleted', function() {

//     });

// });
