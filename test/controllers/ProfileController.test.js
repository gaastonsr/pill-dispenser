'use strict';

var Promise           = require('bluebird');
var sinon             = require('sinon');
var express           = require('express');
var bodyParser        = require('body-parser');
var request           = require('supertest');
var chai              = require('chai');
var toolkit           = require('./../../libs/api-toolkit');
var UsersModel        = require('./../../models/UsersModel');
var ProfileController = require('./../../controllers/ProfileController');

var expect            = chai.expect;
var usersModel        = new UsersModel();
var profileController = new ProfileController(usersModel);

/* FAKE SERVER STUFF */
var app    = express();
var router = express.Router();

var checkSession = function(request, response, next) {
    request.user = {
        id: 1
    };

    next();
};

router.get( '/profile'                     , checkSession, profileController.get);
router.put( '/profile'                     , checkSession, profileController.update);
router.put( '/profile/password'            , checkSession, profileController.updatePassword);
router.post('/profile/email-update-request', checkSession, profileController.requestEmailUpdate);
router.put( '/profile/email/:token'        , profileController.updateEmail);

app.use(bodyParser.json());
app.use(toolkit.energizer());
app.use(router);
/* FAKE SERVER STUFF */

describe('ProfileController', function() {

    describe('#get - when a user profile is fetched', function() {
        afterEach(function() {
            var method = usersModel.getById;

            if (method.restore) {
                method.restore();
            }
        });

        describe('and an unknown error happens', function() {
            var creationDate = new Date();

            beforeEach(function() {
                sinon.stub(usersModel, 'getById', function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return 500 http code', function(done) {
                request(app)
                .get('/profile')
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            var creationDate = new Date();

            beforeEach(function() {
                sinon.stub(usersModel, 'getById', function() {
                    return Promise.resolve({
                        id       : 1,
                        name     : 'John Doe',
                        email    : 'john@doe.com',
                        updatedAt: creationDate,
                        createdAt: creationDate
                    });
                });
            });

            it('should call usersMode.getById with the right arguments', function(done) {
                request(app)
                .get('/profile')
                .end(function(error, response) {
                    expect(usersModel.getById.calledOnce).to.equal(true);
                    expect(usersModel.getById.calledWith({
                        id: 1
                    })).to.equal(true);

                    done();
                });
            });

            it('should return the user profile', function(done) {
                request(app)
                .get('/profile')
                .end(function(error, response) {
                    var body = response.body;

                    expect(body.data.kind).to.equal('UserProfile');
                    expect(body.data.id).to.equal(1);
                    expect(body.data.name).to.equal('John Doe');
                    expect(body.data.email).to.equal('john@doe.com');
                    expect(body.data.updatedAt).to.equal(creationDate.toISOString());
                    expect(body.data.createdAt).to.equal(creationDate.toISOString());

                    done();
                });
            });
        });
    });

    describe('#update - when a profile is updated', function() {
        afterEach(function() {
            var method = usersModel.update;

            if (method.restore) {
                method.restore();
            }
        });

        describe('and the required fields are not sent', function() {
            it('should return ValidationError', function(done) {
                request(app)
                .put('/profile')
                .send({})
                .end(function(error, response) {
                    var body = response.body;

                    expect(response.status).to.equal(400);
                    expect(body.error.code).to.equal(response.status);
                    expect(body.error.name).to.equal('ValidationError');
                    expect(body.error.message).to.be.a('string');
                    expect(body.error.errors).to.contain.a.thing.with.property('location', 'name');

                    done();
                });
            });
        });

        describe('and an unknown error happens', function() {
            beforeEach(function() {
                sinon.stub(usersModel, 'update', function() {
                    var error  = new Error('Unknown error');
                    error.name = 'UnknownError';
                    return Promise.reject(error);
                });
            });

            it('should return 500 http code', function(done) {
                request(app)
                .put('/profile')
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(500);
                    done();
                });
            });
        });

        describe('and everything is fine', function() {
            var updateDate   = new Date();
            var creationDate = new Date().setHours(updateDate.getHours() - 1);

            beforeEach(function() {
                sinon.stub(usersModel, 'update', function() {
                    return Promise.resolve({
                        id       : 1,
                        name     : 'J. Doe',
                        email    : 'john@doe.com',
                        updatedAt: updateDate,
                        createdAt: creationDate
                    });
                });
            });

            it('should call usersModel.update with the right arguments', function(done) {
                request(app)
                .put('/profile')
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(usersModel.update.calledOnce).to.equal(true);
                    expect(usersModel.update.calledWith({
                        userId: 1,
                        name  : 'J. Doe'
                    })).to.equal(true);

                    done();
                });
            });

            it('should return 200 http code', function(done) {
                request(app)
                .put('/profile')
                .send({
                    name: 'J. Doe'
                })
                .end(function(error, response) {
                    expect(response.status).to.equal(200);
                    done();
                });
            });
        });
    });

});
