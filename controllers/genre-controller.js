const Genre = require('../models/genre');
const Book = require('../models/book');

// Displays list of all the genres in the catalog
exports.fetchGenreList = (req, res, next) => {
    Promise.all([
        Genre.find().sort({
            name: 'asc'
        }),
        Book.find().populate('genre')
    ]).then(([
        genres,
        books
    ]) => {
        const results = {
            genres,
            books
        };
        res.render('genre-list', { page: 'All Genres', data: { success: true, message: results } });
    }).catch(err => {
        res.render('genre-list', { page: 'All Genres', data: { success: true, message: 'Unable to load the library catalog\'s genre list at this time.' } });
    });
};