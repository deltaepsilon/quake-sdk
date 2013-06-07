var conf = require('./config/convict.js'),
  request = require('superagent'),
  passport = require('passport'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'https://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

if (conf.get('env') === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Allow https testing with self-signed certs. See https://github.com/visionmedia/superagent/issues/188
}

passport.use(new OAuth2Strategy({
  authorizationURL: quiverRoot + '/quake-sdk/auth/authorize',
  tokenURL: quakeRoot + '/auth/token',
  clientID: conf.get('client_id'),
  clientSecret: conf.get('client_secret'),
  callbackURL: quiverRoot + '/quake-sdk/auth/decision'
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

function getQuakeCookies (res) {
  return res.headers['set-cookie'].pop().split(';')[0];
}

module.exports.middleware = {
  decision: require('./middleware/decision')
}
module.exports.auth = {
    getToken: function(callback) {
      request.get(quiverRoot + '/quake-sdk/auth/authorize').end(function (err, res) {
        console.log('err res', err, res);
        callback();
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
