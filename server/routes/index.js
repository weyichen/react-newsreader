var express = require('express');
var router = express.Router();

var user = require('./user');
var auth = require('./auth');
var subscriptions = require('./subscriptions');
var feed = require('./feed');

router.use('/api/user', user);
router.use('/api/auth', auth);
router.use('/api/subs', subscriptions);
router.use('/api/feed', feed);

module.exports = router;
