const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(() => `/catalog/bookinstance/${this._id}`);

const BookInstance = mongoose.model('BookInstance', BookInstanceSchema);

module.exports = BookInstance;
