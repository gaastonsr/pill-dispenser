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
//         var model  = devicesModel;
//         var method = 'create';
//         var route = {
//             verb: 'post',
//             path: '/devices'
//         };

//         describe('and an unknown error happens', function() {
//             beforeEach(function() {
//                 model[method] = sinon.spy(function() {
//                     var error  = new Error('Unknown error');
//                     error.name = 'UnknownError';
//                     return Promise.reject(error);
//                 });
//             });

//             it('should return http status code 500', function(done) {
//                 request(app)
//                 [route.verb](route.path)
//                 .send({
//                     identifier: '6790ac7c-24ac-4f98-8464-42f6d98a53ae'
//                 })
//                 .end(function(error, response) {
//                     expect(response.status).to.equal(500);
//                     done();
//                 });
//             });
//         });

//         describe('and the data is fine', function() {
//             var updateDate   = new Date();
//             var creationDate = new Date().setHours(updateDate.getHours() - 1);

//             beforeEach(function() {
//                 model[method] = sinon.spy(function() {
//                     return Promise.resolve({
//                         id       : 1000,
//                         name     : 'John Doe',
//                         email    : 'john@doe.com',
//                         status   : '0',
//                         updatedAt: updateDate,
//                         createdAt: creationDate
//                     });
//                 });
//             });

//             it('should call model.method method with the right arguments', function(done) {
//                 request(app)
//                 [route.verb](route.path)
//                 .end(function(error, response) {
//                     expect(model[method].calledOnce).to.equal(true);
//                     expect(model[method].calledWith({
//                         activationToken: 'randomtoken'
//                     })).to.equal(true);

//                     done();
//                 });
//             });

//             it('should return 200 http status code', function(done) {
//                 request(app)
//                 [route.verb](route.path)
//                 .end(function(error, response) {
//                     expect(response.status).to.equal(200);
//                     done();
//                 });
//             });
//         });
//     });

//     describe('#delete - when a device is deleted', function() {

//     });

// });
