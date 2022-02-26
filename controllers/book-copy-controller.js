const BookCopy = require('../models/book-copy');

// Displays list of all the book copies in the catalog
exports.fetchBookCopyList = (req, res, next) => {
    BookCopy.find().populate('book').then(data => {
        res.render('book-copy-list', { page: 'All Book Copies', data: { success: true, message: data } })
    }).catch(err => {
        res.render('book-copy-list', { page: 'All Book Copies', data: { success: false, message: 'Unable to load the library catalog\'s book copies list at this time.' } })
    });
};

// Displays details for a specific book copy
exports.fetchBookCopyDetail = (req, res, next) => {
    BookCopy.findById(req.params.id).populate('book').then(data => {

        if (data === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('book-copy-detail', { page: data._id, data: { success: true, message: data } });
        }
    }).catch(err => {
        res.render('book-copy-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this book copy at this time.' } });
    });
};