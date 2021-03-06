var conf = require('./../config/convict.js') ,
  request = require('superagent'),
  quakeRoot = conf.get('quake_external');

function post (path) {
  return request.post(quakeRoot + path).set('authorization', global.quakeSDKHeader);
}

function get (path) {
  return request.get(quakeRoot + path).query({'access_token': global.quakeSDKToken}).query({token_type: 'bearer'});
}

module.exports = {
  findOrCreate: function(profile, callback) {
    post('/user/findOrCreate').send(profile).end(function (err, res) {
      callback(err, JSON.parse(res.text));
    });
  },

  findByID: function (id, callback) {
    get('/user/' + id).end(function (err, res) {
      callback(err, JSON.parse(res.text));
    });
  }
}
