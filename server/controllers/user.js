var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
var trimUserObject = require('../controllers').trimUserObject;

exports.list = function(req, res) {
  User.find({}).exec()
    .then(users => {
      for (var i = 0; i < users.length; i++) {
        users[i] = trimUserObject(users[i]);
      }
      res.json({ ok: true, data: users });
    })
    .catch(error => res.json({ ok: false, error: error.toString() }));
};


exports.findByUsername = function(req, res) {
  User.findOne({username: req.params.username}).exec()
    .then(user => {
      user = trimUserObject(user);
      res.json({ ok: true, data: user });
    })
    .catch(error => res.json({ ok: false, error: error.toString() }));
}


exports.read = function(req, res) {
  User.findById(req.params.id).exec()
    .then(user => {
      if (!user) {
        return res.json({ ok: false, error: 'Could not find user ' + req.params.id})
      }
      user = trimUserObject(user);
      res.json({ ok: true, data: user });
    })
    .catch(error => res.json({ ok: false, error: error.toString() }));
};


exports.update = function(req, res) {
  User.findById(req.params.id).exec()
    .then(user => {
      for (var property in req.body) {
        user[property] = req.body[property];

        // leave the password unchanged if the field is blank
        if (property === 'password' && user[property] !== "")
          user['password'] = bcrypt.hashSync(user['password']);
      }

      // this is a pure ES6 promise, so we don't have to call .exec()
      return user.save();
    })
    .then(() => res.json({ ok: true }))
    .catch(error => res.json({ ok: false, error: error.toString() }));
};

exports.delete = function(req, res) {
  User.findByIdAndRemove(req.params.id).exec()
    .then(() => res.json({ ok: true }))
    .catch(error => res.json({ ok: false, error: error.toString() }));
}


exports.promoteToAdmin = function(req, res) {
  if (req.params.password !== 'topsecret') {
    return res.send('incorrect promotion password!');
  }

  User.findById(req.params.id).exec()
    .then((user) => {
      user.admin = true;
      return user.save();
    })
    .then(() => res.json({ ok: true }))
    .catch(error => res.json({ ok: false, error: error.toString() }));
}

exports.demoteAdmin = function(req, res) {
  if (req.params.password !== 'topsecret') {
    res.json('incorrect demotion password!');
    return;
  }

  User.findById(req.params.id).exec()
    .then(user => {
      user.admin = false;
      user.save()
        .then(user => res.json(user));
    })
    .catch(err => res.send(err));
}


// Fake user database
var users = [];
users[0] = new User({
  username: 'tj',
  password: 'homelessspa',
  name: 'TJ',
  email: 'tj@vision-media.ca'
});
users[1] = new User({
  username: 'tobi',
  password: 'isagoodboy',
  name: 'Tobi',
  email: 'tobi@vision-media.ca'
});

exports.populate = function(req, res) {
  User.create(users, function (err, addedUsers) {
    if (err) {
      if (err.code === 11000) // handle duplicates
        console.log('username already exists! ignoring...');
      else
        throw err;
    }
    res.redirect('/users');
  });
};

exports.exterminate = function(req, res){
  User.remove({}, function (err) {
    if (err) throw err;
    res.redirect('/users');
  });
};
