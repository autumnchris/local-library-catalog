const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The genre name must be included.'],
    maxLength: [100, 'The genre name must be no more than 100 characters.'],
    unique: true
  }
});

// Virtual for genre's URL
GenreSchema.virtual('url').get(function() {
  return `/catalog/genre/${this._id}`;
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
