const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const AuthorSchema = new Schema({
    name: {
    type: String,
    required: [true, 'The author\'s name must be included.'],
    maxLength: [300, 'The author\'s name must be no more than 300 characters.'],
    unique: true
  },
    dateOfBirth: {
    type: Date
  },
    dateOfDeath: {
    type: Date
  }
});

// Virtual for a formatted version of the author's date of birth
AuthorSchema.virtual('dateOfBirthFormatted').get(function() {
  return this.dateOfBirth ? moment.utc(this.dateOfBirth).format('MMMM Do, YYYY') : 'Unknown';
});

// Virtual for a formatted version of the author's date of death
AuthorSchema.virtual('dateOfDeathFormatted').get(function() {
  return !this.dateOfBirth && !this.dateOfDeath ? 'Unknown' : this.dateOfDeath ? moment.utc(this.dateOfDeath).format('MMMM Do, YYYY') : 'N/A';
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function() {
  return `/catalog/author/${this._id}`;
});

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
