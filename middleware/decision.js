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
    client_secret: conf.get('client_secret')
  }).end(function (aerr, ares) {
    res.setHeader('Content-Type', 'text/json');
    res.end(JSON.stringify(ares.body));
  });

});

module.exports = app;

/*

 test('Auth/authorize should return clientID from env vars', function(done) {
 var redirectURI = 'http://localhost:9000/auth/callback';
 request(app).get('/auth/authorize?client_id=' + conf.get('client_id') + '&response_type=code&redirect_uri=' + redirectURI).expect(200).expect('Content-Type', 'text/json').end(function(err, res) {
 var params = JSON.parse(res.text),
 decision = request(app).post('/auth/authorize/decision'),
 token = request(app).post('/auth/token'),
 cookies = res.headers['set-cookie'].pop().split(';')[0];


 //      console.log(res.headers['set-cookie'].pop().split(';')[0]);
 //TODO Figure out why this cookie shuffle trick is throwing errors. See https://gist.github.com/joaoneto/5152248
 decision.cookies = cookies;
 token.cookies = cookies;

 assert.equal(params.client.id, 'quiver', 'auth/authorize with the core application client_id returns said client_id');
 decision.send({transaction_id: params.transaction_id, user: 'quiver'}).expect(302).end(function(err, res) {
 if (err) { throw new Error(err); }

 var code = res.header.location.match(/code=(.+)/)[1];

 token.send({grant_type: 'authorization_code', code: code, client_id: conf.get('client_id'), client_secret: conf.get('client_secret')}).end(function(err, res) {
 var tokenParams = JSON.parse(res.text);

 assert.isNotNull(tokenParams.access_token, 'Access token should be present');
 assert.equal(tokenParams.token_type, 'bearer', 'Token type should be bearer');
 done();
 });

 });
 });

 */
