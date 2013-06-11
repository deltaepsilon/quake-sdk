var conf = require('./../config/convict.js') ,
  request = require('superagent'),
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port');

module.exports = {
  findOrCreate: function(profile, callback) {
    var findOrCreate = request.post(quakeRoot + '/user/findOrCreate');

    findOrCreate.send(profile).set('authorization', global.quiverSDKHeader).end(function (err, res) {
      callback(err, JSON.parse(res.text));
    });
  }
}
