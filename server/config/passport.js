var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var MSG = require('../config/messages');
var User = require('../models/user');
var trimUserObject = require('../controllers').trimUserObject;

/**
  passport stores only what is specified in serializeUser in the cookie
  on subsequent calls to req.user, deserializeUser is called to retrieve the user object
**/
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then((user) => done(null, trimUserObject(user)))
    .catch((err) => done(err));
});


passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
  function(req, username, password, done) {
    console.log("Authenticating as " + username);
    User.findOne({ 'username': username }).exec() // queries return promises with .exec()
      .then((user) => {
        if (!user)
          return done(null, false, req.flash('authError', MSG.LOGIN_NOT_REGISTERED));
        if (!bcrypt.compareSync(password, user.password))
          return done(null, false, req.flash('authError', MSG.LOGIN_INCORRECT_CREDENTIALS));
        return done(null, user);
      })
      .catch((err) => done(err));
  }
));


passport.use('signup', new LocalStrategy({
  passReqToCallback: true
},
  function(req, username, password, done) {
    console.log("Registering as " + username);
    User.create({ 'username': username, 'password': bcrypt.hashSync(password) }) // async operations return promises
      .then((user) => {
        console.log('Registered as ' + user.username);
        return done(null, user);   
      })
      .catch((err) => {
        if (err.code === 11000) // handle duplicates
          return done(null, false, req.flash('authError', MSG.SIGNUP_USERNAME_TAKEN));
        return done(err);
      });
  }
));
