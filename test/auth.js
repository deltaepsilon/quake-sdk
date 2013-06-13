var express = require('express'),
  app = express(),
  chai = require('chai'),
  assert = chai.assert,
  conf = require('./../config/convict.js'),
  request = require('supertest'),
  sdk = require('./../index.js'),
  server;

suite('Auth', function() {
  suiteSetup(function(done) {
    app.use(sdk.middleware.decision);
    server = app.listen(conf.get('quiver_port'));
    done();
  });

  suiteTeardown(function(done) {
    server.close();
    done();
  });

  test('Auth should return a token', function(done) {
      sdk.auth.getToken('quiver', null, null, function (token) {
        assert.equal(token.length, 36, 'Auth should return a 36-character token');
        done();
      });
  });

});