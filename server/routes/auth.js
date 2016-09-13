var express = require('express');
var passport = require('passport');

var auth = require('../controllers/auth');
var trimUserObject = require('../controllers').trimUserObject;

var router = express.Router();

router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.get('/logout', auth.logout);
router.get('/logged-in-user', auth.getLoggedInUser);

module.exports = router;