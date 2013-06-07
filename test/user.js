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
    sdk.middleware.getToken(function (token) {
      done();
    });
  });

  suiteTeardown(function(done) {
    server.close();
    done();
  });

  test('User can be saved', function(done) {
      //TODO Write this test and then write the feature of user.findOrCreate
  });

});