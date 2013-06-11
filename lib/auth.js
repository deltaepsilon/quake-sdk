var conf = require('./../config/convict.js'),
  request = require('superagent'),
  util = require('./../util.js'),
  passport = require('passport'),
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port'),
  app = require('express')();

/*
 *  Set up passport routes
 */
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

function noop () {}

module.exports = {
  getToken: function(callback) {
    var req = {},
      res = {
        setHeader: function (header, value) { // Mocking the setHeader to capture the auth url. This is dirty black magic... but it does bend the library to my will.
          if (header !== 'Location') { return; }

          request.get(value).end(function (err, res) {
            var cookies = util.getQuakeCookies(res),
              params = JSON.parse(res.text),
              decision = request.post(quakeRoot + '/auth/authorize/decision');

            decision.cookies = cookies;
            decision.send({transaction_id: params.transaction_id, user: 'quiver', redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision'}).end(function (err, res) {
              var token = JSON.parse(res.text).access_token;
              global['quiverSDKToken'] = token;
              global['quiverSDKHeader'] = 'Bearer ' + token;
              callback(token, cookies);
            });
          });
        },
        end: noop
      };

    passport.authenticate('oauth2')(req, res);
  }
}
