const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    enum: [
      'Adventure',
      'Biography',
      'Fantasy',
      'Fiction',
      'Horror',
      'Humanities & Social Sciences',
      'LGBTQ+',
      'Mystery',
      'Nonfiction',
      'Religion & Spirituality',
      'Romance',
      'Sci-Fi',
      'Self-Help',
      'Young Adult & Children\'s'
    ],
    required: [true, 'The genre name must be included.']
  }
});

// Virtual for genre's URL
GenreSchema.virtual('url').get(function() {
  return `/catalog/genre/${this._id}`;
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
