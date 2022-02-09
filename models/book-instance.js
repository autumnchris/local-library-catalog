const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const BookInstanceSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'The book copy\'s associated book must be included.']
  },
  imprint: {
    type: String,
    required: [true, 'The book copy\'s imprint must be included.']
  },
  status: {
    type: String,
    enum: [
      'Available',
      'Reserved',
      'Checked Out',
      'Maintenance'
    ],
    default: 'Maintenance',
    required: [true, 'The book copy\'s status must be included.']
  },
  dueBack: {
    type: Date,
    default: Date.now
  }
});

// Virtual for a formatted version of the book instance's due back date
BookInstanceSchema.virtual('dueBackFormatted').get(function() {
  return moment(this.dueBack).format('MM/DD/YYYY');
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function() {
  return `/catalog/book-instance/${this._id}`;
});

const BookInstance = mongoose.model('BookInstance', BookInstanceSchema);

module.exports = BookInstance;
