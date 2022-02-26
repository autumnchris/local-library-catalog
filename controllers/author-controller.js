const validator = require('validator');
const Author = require('../models/author');
const Book = require('../models/book');

// Displays list of all the authors in the catalog
exports.fetchAuthorList = (req, res, next) => {
    Author.find().sort({
        name: 'asc'
    }).then(data => {
        res.render('author-list', { page: 'All Authors', data: { success: true, message: data } });
    }).catch(err => {
        res.render('author-list', { page: 'All Authors', data: { success: false, message: 'Unable to load the library catalog\'s author list at this time.' } });
    });
};

// Display details for a specific author
exports.fetchAuthorDetail = (req, res, next) => {   
    Promise.all([
        Author.findById(req.params.id),
        Book.find({
            author: req.params.id
        }, 'title summary')
    ]).then(([
        authorDetails,
        booksWithAuthor
    ]) => {
        const results = {
            authorDetails,
            booksWithAuthor
        };

        if (results.authorDetails === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('author-detail', { page: authorDetails.name, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('author-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this author at this time.' } });
    });
};