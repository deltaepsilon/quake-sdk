var conf = require('./config/convict.js'),
  request = require('superagent'),
  passportLib = require('./lib/passport'),
  decision = require('./middleware/decision');


/*
 *  Allow https testing with self-signed certs. See https://github.com/visionmedia/superagent/issues/188
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/*
 *  Set up a dummy route to initiate an auth transaction. Easier to do it this way than to just call passport.authenticate
 */
//decision.get('/quake-sdk/auth', passport.authenticate('oauth2', { failureRedirect: '/auth/failure' }), function(req, res) {
//  return res.redirect('/auth/success');
//});


/*
 *  Exports
*/
module.exports.passport = passportLib.getPassport();

module.exports.middleware = {
  decision: decision
};

module.exports.auth = require('./lib/auth.js');

module.exports.user = require('./lib/user.js');
