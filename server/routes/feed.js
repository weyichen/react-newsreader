var express = require('express');
var router = express.Router();

var sampleSubs = require('../sampleSubs');
var Feed = require('../models/feed');

router.get('/', (req, res) => {
  Feed.find({}).exec()
  .then(feeds => res.json({ ok: true, data: feeds }))
  .catch(error => res.json({ ok: false, error: error }));
});

router.post('/', (req, res) => {
  Feed.create({
    name: req.body.name,
    rss: req.body.rss,
    image: req.body.image
  })
  .then(feed => res.json({ ok: true, data: feed }))
  .catch(error => res.json({ ok: false, error: error }));
});

router.delete('/:id', (req, res) => {
  Feed.findByIdAndRemove(req.params.id).exec()
  .then(() => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));
});

router.get('/populate', (req, res) => {
  Feed.create(sampleSubs)
  .then(feeds => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));
})

module.exports = router;