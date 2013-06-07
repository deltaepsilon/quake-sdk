var conf = require('./config/convict.js'),
  request = require('superagent'),
  passport = require('passport'),
  decision = require('./middleware/decision'),
  util = require('./util.js')
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

if (conf.get('env') === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Allow https testing with self-signed certs. See https://github.com/visionmedia/superagent/issues/188
}

passport.use(new OAuth2Strategy({
  authorizationURL: quakeRoot + '/auth/authorize',
  tokenURL: quakeRoot + '/auth/token',
  clientID: conf.get('client_id'),
  clientSecret: conf.get('client_secret'),
  callbackURL: quiverRoot + '/quake-sdk/auth/authorize/decision'
}, function (accessToken, refreshToken, profile, done) {
  done(null, profile);
  callback(accessToken);
}));

/*
 passport.use(new GoogleStrategy({
 clientID: conf.get('google_id'),
 clientSecret: conf.get('google_secret'),
 callbackURL: '/quiver-auth/google/return'
 }, function(accessToken, refreshToken, profile, done) {
 process.nextTick(function() {
 return done(null, profile);
 });

 }));

 */





decision.get('/quake-sdk/auth', passport.authenticate('oauth2', { failureRedirect: '/failure' }), function(req, res) {
  return res.redirect('/success');
});

module.exports.passport = passport;

module.exports.middleware = {
  decision: decision
};

module.exports.auth = {
    getToken: function(callback) {
      request.get(quiverRoot + '/quake-sdk/auth').end(function (err, res) {
        var cookies = util.getQuakeCookies(res),
          params = JSON.parse(res.text),
          decision = request.post(quakeRoot + '/auth/authorize/decision');

        decision.cookies = cookies;
        decision.send({transaction_id: params.transaction_id, user: 'quiver', redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision'}).end(function (err, res) {
          callback(JSON.parse(res.text).access_token);
        });
      });

//      var redirectURI = quiverRoot + '/quake-sdk/auth/decision',
//        decision = request.post(quakeRoot + '/auth/authorize/decision');
//
//      request.get(quakeRoot + '/auth/authorize?response_type=code&client_id=' + conf.get('client_id')).end(function (err, res) {
//        var params = JSON.parse(res.text),
//          cookies = getQuakeCookies(res);
//        decision.cookies = cookies
//
//        console.log('sending');
//        decision.send({transaction_id: params.transaction_id, user: 'quiver', redirect_uri: redirectURI}).end(function (err, res) {
//          console.log('post callback', res.text);
//          callback();
//        });
//      });
    }
}

module.exports.user = {
  findOrCreate: function(profile, callback) {

  }
}
