var conf = require('./../config/convict.js'),
  request = require('superagent'),
  util = require('./../util.js'),
  passportLib = require('./../lib/passport'),
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

/*
 *  Set up passport routes
 */
function noop () {}

module.exports = {
  getToken: function(userID, clientID, clientSecret, callback) {
    if (arguments.length !== 4) {
      throw new Error('Bad getToken call. You need four arguments');
    }
    var id = clientID || conf.get('client_id'),
      secret = clientSecret || conf.get('client_secret'),
      req = {},
      res = {
        setHeader: function (header, value) { // Mocking res.setHeader to capture the auth url. This is dirty black magic that bends the library over backwards to meet my needs.
          if (header !== 'Location') { return; }

          request.get(value).end(function (err, res) {
            if (err) { throw new Error(err)}
            var cookies = util.getQuakeCookies(res),
              params = JSON.parse(res.text),
              decision = request.post(quakeRoot + '/auth/authorize/decision');

            decision.cookies = cookies;
            decision.send({transaction_id: params.transaction_id, user: userID, redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision/' + id}).end(function (err, res) {
              var token = JSON.parse(res.text).access_token,
                header = 'Bearer ' + token;

              if (userID === 'quiver') { // Set global SDK token and header for quiver user
                global['quakeSDKToken'] = token;
                global['quakeSDKHeader'] = header;
              }

              callback(token, header);
            });
          });
        },
        end: noop
      };

    passportLib.getPassport(id, secret).authenticate('oauth2')(req, res);
  }


}
