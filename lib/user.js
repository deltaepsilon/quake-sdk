var conf = require('./../config/convict.js') ,
  request = require('superagent'),
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  token = global.quiverSDKToken,
  cookies = global.quiverSDKCookies,
  _ = require('underscore');

module.exports = {
  findOrCreate: function(profile, callback) {
    var findOrCreate = request.post(quakeRoot + '/user/findOrCreate');
    findOrCreate.cookies = cookies;

    console.log('****************');
    findOrCreate.send(profile).set('authorization', global.quiverSDKToken).end(function (err, res) {
      callback(err, res);
    });
  }
}
