'use strict';

var express           = require('express');
var request           = require('supertest');
var chai              = require('chai');
var SessionsModelStub = require('./stubs/SessionsModelStub');
var sessionChecker    = require('./../../middlewares/sessionChecker');

var expect            = chai.expect;
var sessionsModelStub = new SessionsModelStub();
var checkSession      = sessionChecker(sessionsModelStub);

/* FAKE SERVER STUFF */
var app = express();

app.get('/', checkSession, function(request, response, next) {
    return response.status(200).json(request.user);
});
/* FAKE SERVER STUFF */

describe('sessionChecker', function() {

    describe('when bearer token is absent', function() {
        it('should return 401 TokenNotFound', function(done) {
            request(app)
            .get('/')
            .end(function(error, response) {
                var body = response.body;

                expect(response.status).to.equal(401);
                expect(body.error.code).to.equal(response.status);
                expect(body.error.name).to.equal('TokenNotFound');

                done();
            });
        });
    });

    describe('when bearer token is empty', function() {
        it('should return 401 TokenNotFound', function(done) {
            request(app)
            .get('/')
            .set('Authorization', 'Bearer')
            .end(function(error, response) {
                var body = response.body;

                expect(response.status).to.equal(401);
                expect(body.error.code).to.equal(response.status);
                expect(body.error.name).to.equal('TokenNotFound');

                done();
            });
        });
    });

    describe('when bearer token is invalid', function() {
        it('should return 401 InvalidToken', function(done) {
            request(app)
            .get('/')
            .set('Authorization', 'Bearer invalidtoken')
            .end(function(error, response) {
                var body = response.body;

                expect(response.status).to.equal(401);
                expect(body.error.code).to.equal(response.status);
                expect(body.error.name).to.equal('InvalidToken');

                done();
            });
        });
    });

    describe('when bearer token is expired', function() {
        it('should return 401 ExpiredSession', function(done) {
            request(app)
            .get('/')
            .set('Authorization', 'Bearer expiredsession')
            .end(function(error, response) {
                var body = response.body;

                expect(response.status).to.equal(401);
                expect(body.error.code).to.equal(response.status);
                expect(body.error.name).to.equal('ExpiredSession');

                done();
            });
        });
    });

    describe('when there is an error in the server', function() {
        it('should return 500 ServerError', function(done) {
            request(app)
            .get('/')
            .set('Authorization', 'Bearer servererror')
            .end(function(error, response) {
                expect(response.status).to.equal(500);
                done();
            });
        });
    });

    describe('when bearer token is valid', function() {
        it('should return the profile data', function(done) {
            request(app)
            .get('/')
            .set('Authorization', 'Bearer validtoken')
            .end(function(error, response) {
                var body = response.body;
                expect(body.id).to.equal(1);
                done();
            });
        });
    });

});
