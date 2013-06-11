var conf = require('./config/convict.js'),
  request = require('superagent'),
  passport = require('passport'),
  decision = require('./middleware/decision'),
  util = require('./util.js')
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  quakeRoot = 'https://' + conf.get('quake_host') + ':' + conf.get('quake_port'),
  quiverRoot = 'http://' + conf.get('quiver_host') + ':' + conf.get('quiver_port');


/*
 *  Allow https testing with self-signed certs. See https://github.com/visionmedia/superagent/issues/188
*/
if (conf.get('env') === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/*
 *  Set up a dummy route to initiate an auth transaction. Easier to do it this way than to just call passport.authenticate
 */
//decision.get('/quake-sdk/auth', passport.authenticate('oauth2', { failureRedirect: '/auth/failure' }), function(req, res) {
//  return res.redirect('/auth/success');
//});


/*
 *  Exports
*/
module.exports.passport = passport;

module.exports.middleware = {
  decision: decision
};

module.exports.auth = require('./lib/auth.js');

module.exports.user = require('./lib/user.js');
