const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: {
    type: String,
    required: [true, 'The author\'s name must be included.'],
    maxLength: [300, 'The author\'s name must be no more than 300 characters.']
  },
    yearOfBirth: {
    type: Date
  },
    yearOfDeath: {
    type: Date
  }
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(() => `/catalog/author/${this._id}`);

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
