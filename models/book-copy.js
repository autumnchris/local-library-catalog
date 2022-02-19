const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const BookCopySchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'The book copy\'s associated book must be included.']
  },
  publisher: {
    type: String,
    required: [true, 'The book copy\'s publisher must be included.']
  },
  status: {
    type: String,
    enum: [
      'Available',
      'Reserved',
      'Loaned',
      'Maintenance'
    ],
    default: 'Maintenance',
    required: [true, 'The book copy\'s status must be included.']
  },
  dueBack: {
    type: Date
  }
});

// Virtual for a formatted version of the book copy's due back date
BookCopySchema.virtual('dueBackFormatted').get(function() {
  return this.status === 'Loaned' && !this.dueBack ? 'Return date not specified.' : moment.utc(this.dueBack).format('MM/DD/YYYY');
});

// Virtual for book copy's URL
BookCopySchema.virtual('url').get(function() {
  return `/catalog/book-copy/${this._id}`;
});

const BookCopy = mongoose.model('BookCopy', BookCopySchema);

module.exports = BookCopy;
