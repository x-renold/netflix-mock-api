const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const dataSchema = new mongoose.Schema({
  poster_path: String,
  adult: Boolean,
  overview: String,
  release_date: Date,
  genre_ids: [{
    type: mongoose.Types.ObjectId,
    ref: 'Genre'
  }],
  id: {
    type: String,
    unique: true,
    dropDups: true
  },
  original_title: String,
  original_language: String,
  title: String,
  backdrop_path: String,
  popularity: Number,
  vote_count: Number,
  video: Boolean,
  vote_average: Number
})

dataSchema.plugin(paginate);

module.exports = mongoose.model('Movie', dataSchema);