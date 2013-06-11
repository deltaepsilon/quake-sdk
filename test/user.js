var express = require('express'),
  app = express(),
  chai = require('chai'),
  assert = chai.assert,
  conf = require('./../config/convict.js'),
  request = require('supertest'),
  sdk = require('./../index.js'),
  userMock = require('./mocks/userMock.js'),
  server,
  token,
  newCookies;

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
    sdk.user.findOrCreate(userMock, function (err, res) {
      console.log('test/user.js err, res', res.text);
      done();
    });
  });

});