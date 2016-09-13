var express = require('express');
var router = express.Router();

var user = require('../controllers/user');
//var isAuthorized = require('./isAuthorized');

// check if the page belongs to the logged in user
router.use('/:id', function(req, res, next) {
  if (req.user && req.params.id) {
    // use == cause req.user._id is an object while params.id is a string
    if (req.user._id == req.params.id) {
      res.locals.own = true;
    }
    if (req.user.admin) {
      res.locals.admin = true;
    }
  }
  return next();
});

// edit and delete only available to users themselves and administrators
var isAuthorized = function(req, res, next) {
  if (res.locals.own || res.locals.admin)
    return next();
  res.status(403).send('Not authorized.');
};

// When called from a middleware, the mount point (/api/user) is not included in req.path
router.get('/list', user.list);
router.get('/username/:username', user.findByUsername);
router.get('/:id', user.read);
router.put('/:id', isAuthorized, user.update);
router.delete('/:id', isAuthorized, user.delete);

// hack to promote user to admin
router.get('/promoteToAdmin/:id/:password', user.promoteToAdmin);

module.exports = router;
