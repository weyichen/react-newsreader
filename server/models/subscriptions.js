var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var feedSchema = new Schema({
  name: { type: String, required: true },
  rss: { type: String, required: true, unique: true }
});

var subscriptionsSchema = new Schema({
  user: { type: String, required: true, unique: true },
  subs: [feedSchema]
});

module.exports = mongoose.model('Subscriptions', subscriptionsSchema);