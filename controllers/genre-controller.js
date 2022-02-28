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

// Displays details for a specific genre
exports.fetchGenreDetail = (req, res, next) => {
    Promise.all([
        Genre.findById(req.params.id),
        Book.find({
            genre: req.params.id
        }).populate('author')
    ]).then(([
        genreDetails,
        booksWithGenre
    ]) => {
        const results = {
            genreDetails,
            booksWithGenre
        };

        if (results.genreDetails === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('genre-detail', { page: genreDetails.name, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('genre-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this genre at this time.' } });
    });
};