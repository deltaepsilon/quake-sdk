var conf = require('./../config/convict.js'),
  express = require('express'),
  app = express(),
  request = require('superagent'),
  util = require('./../util.js'),
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

app.get('/quake-sdk/auth/authorize/decision', function (req, res) {
  var params = req.query,
    cookies = util.getQuakeCookies(req),
    token = request.post(quakeRoot + '/auth/token');

  token.cookies = cookies;

  token.send({
    grant_type: 'authorization_code',
    code: params.code,
    client_id: conf.get('client_id'),
    client_secret: conf.get('client_secret'),
    redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision'
  }).end(function (aerr, ares) {
      res.setHeader('Content-Type', 'text/json');
      res.end(JSON.stringify(ares.body));
    });

});

module.exports = app;