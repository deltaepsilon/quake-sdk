var conf = require('./config/convict.js'),
  passport = require('passport'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

module.exports.user = {
  auth: function(callback) {
    passport.use(new OAuth2Strategy());
  },
  findOrCreate: function(profile, callback) {

  }
}
