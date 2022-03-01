const validator = require('validator');
const BookCopy = require('../models/book-copy');
const Book = require('../models/book');

function validateForm(formData, dueBackDate) {

    if (!formData.book) {
        return 'The book copy\'s associated book must be included.';
    }
    else if (!formData.publisher) {
        return 'The book copy\'s publisher must be included.';
    }
    else if (!formData.status) {
        return 'The book copy\'s status must be included.';
    }
    else if (formData.dueBack && !validator.isDate(dueBackDate, { format: 'YYYY-MM-DD', strictMode: true })) {
        return 'The book copy\'s due back date is not in a recognized format.';
    }
    else {
        return null;
    }
}

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

// Displays new book copy form
exports.fetchBookCopyCreateForm = (req, res, next) => {
    Book.find({}, 'title isbn').then(data => {
        const results = {
            books: data,
            bookCopy: null
        };
        res.render('book-copy-form', { page: 'Add New Book Copy', data: { success: true, message: results }, errorMessage: null });
    }).catch(err => {
        res.render('book-copy-form', { page: 'Add New Book Copy', data: { success: false, message: 'Unable to load the Add New Book Copy form at this time.' }, errorMessage: null });
    });
};

// Handles creation of new book copy
exports.createNewBookCopy = (req, res, next) => {
    const bookCopy = new BookCopy({
        book: req.body.book,
        publisher: req.body.publisher.trim(),
        status: req.body.status,
        dueBack: req.body.status === 'Loaned' ? req.body.dueBack.trim() : null
    });

    Book.find({}, 'title isbn').then(data => {
        const results = {
            books: data,
            bookCopy
        };

        if (validateForm(bookCopy, req.body.dueBack)) {
            res.render('book-copy-form', { page: 'Add New Book Copy', data: { success: true, message: results }, errorMessage: validateForm(bookCopy, req.body.dueBack) });
        }
        else {
            bookCopy.save().then(data => {
                res.redirect(bookCopy.url);
            }).catch(err => {
                res.render('book-copy-form', { page: 'Add New Book Copy', data: { success: true, message: results }, errorMessage: 'Something went wrong. A form value might have been entered incorrectly. Please try again.' });
            });
        }
    }).catch(err => {
        res.render('book-copy-form', { page: 'Add New Book Copy', data: { success: false, message: 'Unable to add a new book copy at this time.' }, errorMessage: null });
    });
};

// Displays edit book copy form
exports.fetchBookCopyUpdateForm = (req, res, next) => {
    Promise.all([
        BookCopy.findById(req.params.id).populate('book'),
        Book.find({}, 'title isbn')
    ]).then(([
        bookCopy,
        books
    ]) => {
        const results = {
            bookCopy,
            books
        };

        if (results.bookCopy === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('book-copy-form', { page: 'Edit Book Copy', data: { success: true, message: results }, errorMessage: null });
        }
    }).catch(err => {
        res.render('book-copy-form', { page: 'Edit Book Copy', data: { success: false, message: 'Unable to load the Edit Book Copy form at this time.' }, errorMessage: null });
    });
};

// Handles update of specific book copy
exports.updateBookCopy = (req, res, next) => {
    const bookCopy = new BookCopy({
        book: req.body.book,
        publisher: req.body.publisher.trim(),
        status: req.body.status,
        dueBack: req.body.status === 'Loaned' ? req.body.dueBack.trim() : null,
        _id: req.params.id
    });

    Book.find({}, 'title isbn').then(data => {
        const results = {
            books: data,
            bookCopy
        };

        if (validateForm(bookCopy, req.body.dueBack)) {
            res.render('book-copy-form', { page: 'Edit Book Copy', data: { success: true, message: results }, errorMessage: validateForm(bookCopy, req.body.dueBack) });
        }
        else {
            BookCopy.findByIdAndUpdate(req.params.id, bookCopy).then(data => {
                res.redirect(data.url);
            }).catch(err => {
                res.render('book-copy-form', { page: 'Edit Book Copy', data: { success: true, message: results }, errorMessage: 'Something went wrong. A form value might have been entered incorrectly. Please try again.' });
            });
        }
    }).catch(err => {
        res.render('book-copy-form', { page: 'Edit Book Copy', data: { success: false, message: 'Unable to edit this book copy at this time.' }, errorMessage: null });
    });
};