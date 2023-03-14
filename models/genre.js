const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  id: {
    required: true,
    type: String,
    unique: true,
    dropDups: true
  }
});

module.exports = mongoose.model('Genre', dataSchema);