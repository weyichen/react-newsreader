var express = require('express');
var router = express.Router();

var sampleSubs = require('../sampleSubs');
var Feed = require('../models/feed');

router.get('/list', (req, res) => {
  Feed.find({}).exec()
  .then(feeds => res.json({ ok: true, data: feeds }))
  .catch(error => res.json({ ok: false, error: error }));
});

// find feed source in DB by its url
router.get('/', (req, res) => {
  Feed.findOne({rss: req.query.rss})
  .then(feed => {
    if (feed) return res.json({ ok: true, data: feed });
    return res.json({ ok: true });
  })
  .catch(error => res.json({ ok: false, error: error }));
})

router.post('/', (req, res) => {
  let {name, rss, description, image} = req.body;

  Feed.create(req.body)
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
});

router.get('/exterminate', (req, res) => {
  Feed.remove({})
  .then(() => res.json({ ok: true }))
  .catch(error => res.json({ ok: false, error: error }));
});


module.exports = router;