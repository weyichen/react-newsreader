var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var feedSchema = new Schema({
  name: { type: String, required: true },
  rss: { type: String, required: true, unique: true },
  image: String
});

module.exports = mongoose.model('Feed', feedSchema);