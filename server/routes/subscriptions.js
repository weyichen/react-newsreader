var express = require('express');
var router = express.Router();

var Subscriptions = require('../models/subscriptions');
var sampleSubs = require('../sampleSubs');

router.get('/', (req, res) => {
  if (!req.user) {
    return res.json({ok: true, data: sampleSubs});
  }

  let username = req.user.username;

  Subscriptions.findOne({user: username}).exec()
  .then(subs => {
    if (!subs) {
      return Subscriptions.create({
        user: username,
        subs: sampleSubs
      });
    }
    return subs;
  })
  .then(subs => res.json({ ok: true, data: subs.subs }))
  .catch(error => res.json({ ok: false, error: error }));
});

router.post('/', (req, res) => {
  if (!req.user)
    return res.json({ ok: false, error: 'Not logged in.' });

  Subscriptions.findOne({user: req.user.username}).exec()
  .then(subs => {
    subs.subs = req.body.subs;
    return subs.save();
  })
  .then(subs => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));
})

router.delete('/', (req, res) => {
  if (!req.user)
    return res.json({ ok: false, error: 'Not logged in.' });

  Subscriptions.findOneAndRemove({user: req.user.username}).exec()
  .then(() => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));  
})

router.get('/exterminate', (req, res) => {
  if (!req.user)
    return res.json({ ok: false, error: 'Not logged in.' });

  Subscriptions.findOne({user: req.user.username}).exec()
  .then(subs => {
    subs.subs = [];
    return subs.save();
  })
  .then(subs => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));
})

module.exports = router;

