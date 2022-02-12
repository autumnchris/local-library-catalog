const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/book-instance');

exports.fetchCatalogCount = (req, res, next) => {
    Promise.all([
        Book.countDocuments({}),
        BookInstance.countDocuments({}),
        BookInstance.countDocuments({ status: 'Available' }),
        Author.countDocuments({}),
        Genre.countDocuments({})
    ]).then(([
        bookCount,
        bookInstanceCount,
        availableBookInstanceCount,
        authorCount,
        genreCount 
    ]) => {
        const results = {
            bookCount,
            bookInstanceCount,
            availableBookInstanceCount,
            authorCount,
            genreCount 
        };
        res.render('index', { data: { success: true, message: results } });
    }).catch(err => {
        res.render('index', { data: { success: false, message: 'Unable to load the library\'s total catalog count at this time.' } });
    });
};
