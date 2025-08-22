const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: {
    type: String,
    enum: ['Fiction', 'Biography', 'Fantasy'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
});

module.exports = mongoose.model('Book', BookSchema);
