const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true,
    dropDups: true
  },
  password: {
    required: true,
    type: String
  },
  favouriteMovies: [{
    type: mongoose.Types.ObjectId,
    ref: 'Movie'
  }]
});

module.exports = mongoose.model('User', dataSchema);