var conf = require('./../config/convict.js'),
  passport = require('passport'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  quakeRoot = conf.get('quake_external'),
  quiverRoot = conf.get('quiver_external');

/*
 *  Set up passport routes
 */

module.exports = {
  getPassport: function (clientID, clientSecret) {
    var id = clientID || conf.get('client_id'),
      secret = clientSecret || conf.get('client_secret');
    passport.use(new OAuth2Strategy({
      authorizationURL: quakeRoot + '/auth/authorize',
      tokenURL: quakeRoot + '/auth/token',
      clientID: id,
      clientSecret: secret,
      callbackURL: quiverRoot + '/quake-sdk/auth/authorize/decision/' + id + '/' + secret
    }, function (accessToken, refreshToken, profile, done) {
      done(null, profile);
      callback(accessToken);
    }));
    return passport;
  }
}