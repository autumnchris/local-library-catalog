const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookCopy = require('../models/book-copy');

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