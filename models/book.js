const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'The book\'s title must be included.']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'The book\'s author must be included.']
  },
  summary: {
    type: String,
    required: [true, 'The book\'s summary must be included.']
  },
  isbn: {
    type: String,
    required: [true, 'The book\'s ISBN number must be included.'],
    unique: true
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre'
  }]
},
{
  strictQuery: true
});

// Virtual for book's URL
BookSchema.virtual('url').get(function() {
  return `/catalog/book/${this._id}`;
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
