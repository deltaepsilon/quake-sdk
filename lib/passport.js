var conf = require('./../config/convict.js'),
  passport = require('passport'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

/*
 *  Set up passport routes
 */


module.exports = {
  getPassport: function () {
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
    return passport;
  }
}