const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookCopy = require('../models/book-copy');

// Displays the counts for all items in the catalog
exports.fetchCatalogCount = (req, res, next) => {
    Promise.all([
        Book.countDocuments(),
        BookCopy.countDocuments(),
        BookCopy.countDocuments({ status: 'Available' }),
        Author.countDocuments(),
        Genre.countDocuments()
    ]).then(([
        bookCount,
        bookCopyCount,
        availableBookCopyCount,
        authorCount,
        genreCount 
    ]) => {
        const results = {
            bookCount,
            bookCopyCount,
            availableBookCopyCount,
            authorCount,
            genreCount 
        };
        res.render('index', { data: { success: true, message: results } });
    }).catch(err => {
        res.render('index', { data: { success: false, message: 'Unable to load the library\'s total catalog count at this time.' } });
    });
};

// Displays list of all the books in the catalog
exports.fetchBookList = (req, res, next) => {
    Book.find({}, 'title author').sort({
        title: 'asc'
    }).populate('author').then(data => {
        res.render('book-list', { page: 'All Books', data: { success: true, message: data } });
    }).catch(err => {
        res.render('book-list', { page: 'All Books', data: { success: false, message: 'Unable to load the library catalog\'s book list at this time.' } });
    });
};
  
  // Display details for a specific book
  exports.fetchBookDetail = (req, res, next) => {
      Promise.all([
          Book.findById(req.params.id).populate('author').populate('genre'),
          BookCopy.find({
              book: req.params.id
          })
      ]).then(([
          bookDetails,
          bookCopiesWithBook
      ]) => {
          const results = {
              bookDetails,
              bookCopiesWithBook
          };
          
          if (results.bookDetails === null) {
              res.status(404).render('404', { page: 'Page not found' });
          }
          else {
              res.render('book-detail', { page: bookDetails.title, data: { success: true, message: results } });
          }
      }).catch(err => {
          res.render('book-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this book at this time.' } });
      });
  };