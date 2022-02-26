const validator = require('validator');
const Author = require('../models/author');

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