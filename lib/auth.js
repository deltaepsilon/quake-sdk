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
    var req = {},
      res = {
        setHeader: function (header, value) { // Mocking the setHeader to capture the auth url. This is dirty black magic... but it does bend the library to my will.
          if (header !== 'Location') { return; }

          request.get(value).end(function (err, res) {
            var cookies = util.getQuakeCookies(res),
              params = JSON.parse(res.text),
              decision = request.post(quakeRoot + '/auth/authorize/decision');

            decision.cookies = cookies;
            decision.send({transaction_id: params.transaction_id, user: userID, redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision'}).end(function (err, res) {
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

    passportLib.getPassport(clientID, clientSecret).authenticate('oauth2')(req, res);
  }


}
