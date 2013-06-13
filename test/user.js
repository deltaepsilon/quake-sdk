var express = require('express'),
  app = express(),
  chai = require('chai'),
  assert = chai.assert,
  conf = require('./../config/convict.js'),
  request = require('supertest'),
  sdk = require('./../index.js'),
  userMock = require('./mocks/userMock.js'),
  savedUser,
  server,
  token;

suite('Auth', function() {
  suiteSetup(function(done) {
    app.use(sdk.middleware.decision);
    server = app.listen(conf.get('quiver_port'));
    sdk.auth.getToken('quiver', null, null, function (newToken, newCookies) {
      done();
    });
  });

  suiteTeardown(function(done) {
    server.close();
    done();
  });

  test('User can be saved', function(done) {
    sdk.user.findOrCreate(userMock, function (err, user) {
      savedUser = user
      assert.equal(userMock.id, user.providerID, 'User should be saved with a matching providerID.');
      done();
    });
  });

  test('New user can auth with server', function (done) {
    sdk.auth.getToken(savedUser.id, savedUser.clientID, savedUser.clientSecret, function (token, header) {
      assert.equal(token.length, 36, 'New user can auth with server... 36 character token should be returned');
      assert.equal('Bearer ' + token, header, 'Header should be a bearer token header');
      done();
    });
  });

});