const BookCopy = require('../models/book-copy');

// Displays list of all the book copies in the catalog
exports.fetchBookCopyList = (req, res, next) => {
    BookCopy.find().populate('book').then(data => {
        res.render('book-copy-list', { page: 'All Book Copies', data: { success: true, message: data } })
    }).catch(err => {
        res.render('book-copy-list', { page: 'All Book Copies', data: { success: false, message: 'Unable to load the library catalog\'s book copies list at this time.' } })
    });
};