var passport = require('passport');

const MSG = require('../config/messages');
var trimUserObject = require('../controllers').trimUserObject;
var checkRequiredFields = require('../controllers').checkRequiredFields;

exports.login = function(req, res) {
  var requiredFields = ['username', 'password'];
  if (!checkRequiredFields(req.body, requiredFields))
    return res.json({ ok: false, error: MSG.LOGIN_FIELD_EMPTY });

  usePassportStrategy('login', passport, req)
    .then(user => res.json({ ok: true, data: user }))
    .catch(error => res.json({ ok: false, error: error }))
};


exports.logout = function(req, res) {
  req.logout();
  if (!req.user)
    res.json({ ok: true });
  else
    res.json({ ok: false });
};


exports.getLoggedInUser = function (req, res) {
  if (req.user){
    res.json({ ok: true, data: req.user });
  }
  else
    res.json({ ok: true });
};


exports.signup = function(req, res, next) {
  var requiredFields = ['username', 'password'];
  if (!checkRequiredFields(req.body, requiredFields))
    return res.json({ ok: false, error: MSG.SIGNUP_FIELD_EMPTY });

  usePassportStrategy('signup', passport, req)
    .then(user => res.json({ ok: true, data: user }))
    .catch(error => res.json({ ok: false, error: error }));
};


/** 
  need to place callback within passport.authenticate call
  if placed outside, will only be called if authentication is successful
  if failed, POST to /login will return Forbidden status
**/
function usePassportStrategy(strategy, passport, request) {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategy, function(error, user) {
      if (error)
        return reject(error.toString()); // use .toString() whenever returning an error object in json
      if (!user)
        return reject(request.flash().authError[0]);

      user = trimUserObject(user);
      request.login(user, function(error) {
        if (error) 
          return reject(error.toString());
        return resolve(request.user);
      });
    })(request);
  });
}