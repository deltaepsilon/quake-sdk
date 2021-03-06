var conf = require('./../config/convict.js'),
  express = require('express'),
  app = express(),
  request = require('superagent'),
  util = require('./../util.js'),
  quakeRoot = conf.get('quake_external'),
  quiverRoot = conf.get('quiver_external');

app.get('/quake-sdk/auth/authorize/decision/:clientID/:clientSecret', function (req, res) {
  var params = req.query,
    id = req.params.clientID,
    secret = req.params.clientSecret,
    cookies = util.getQuakeCookies(req),
    token = request.post(quakeRoot + '/auth/token');

  token.cookies = cookies;

  token.send({
    grant_type: 'authorization_code',
    code: params.code,
    client_id: id,
    client_secret: secret,
    redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision/' + id + '/' + secret
  }).end(function (aerr, ares) {
      res.setHeader('Content-Type', 'text/json');
      res.end(JSON.stringify(ares.body));
    });

});

module.exports = app;