var conf = require('./config/convict.js'),
  express = require('express'),
  app = express(),
  sdk = require('./index.js');

app.use(sdk.middleware.decision);

app.get('/quake-sdk/auth', sdk.passport.authenticate('oauth2', { failureRedirect: '/failure' }), function(req, res) {
  return res.redirect('/success');
});

console.log('listening on port ' + conf.get('quiver_port'));
app.listen(conf.get('quiver_port'));
