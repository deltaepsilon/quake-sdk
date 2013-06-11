var express = require('express'),
  app = express(),
  chai = require('chai'),
  assert = chai.assert,
  conf = require('./../config/convict.js'),
  request = require('supertest'),
  sdk = require('./../index.js'),
  userMock = require('./mocks/userMock.js'),
  server,
  token;

suite('Auth', function() {
  suiteSetup(function(done) {
    app.use(sdk.middleware.decision);
    server = app.listen(conf.get('quiver_port'));
    sdk.auth.getToken(function (newToken, newCookies) {
      done();
    });
  });

  suiteTeardown(function(done) {
    server.close();
    done();
  });

  test('User can be saved', function(done) {
    sdk.user.findOrCreate(userMock, function (err, user) {
      assert.equal(userMock.id, user.providerID, 'User should be saved with a matching providerID.');
      done();
    });
  });

});