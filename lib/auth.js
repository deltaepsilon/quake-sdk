var conf = require('./../config/convict.js'),
  request = require('superagent'),
  util = require('./../util.js')
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');

module.exports = {
  getToken: function(callback) {
    request.get(quiverRoot + '/quake-sdk/auth').end(function (err, res) {
      var cookies = util.getQuakeCookies(res),
        params = JSON.parse(res.text),
        decision = request.post(quakeRoot + '/auth/authorize/decision');

      decision.cookies = cookies;
      decision.send({transaction_id: params.transaction_id, user: 'quiver', redirect_uri: quiverRoot + '/quake-sdk/auth/authorize/decision'}).end(function (err, res) {
        var token = JSON.parse(res.text).access_token;
        global['quiverSDKToken'] = token;

        callback(token);
      });
    });

  }
}
