const mongoose = require('mongoose');
const normalizeUrl = require('normalize-url');

var Schema = mongoose.Schema;

var feedSchema = new Schema({
  name: { type: String, required: true },
  rss: { type: String, required: true, unique: true },
  description: String,
  image: String
});

feedSchema.pre('save', function(next) {
  this.rss = normalizeUrl(this.rss);
  next();
});

module.exports = mongoose.model('Feed', feedSchema);