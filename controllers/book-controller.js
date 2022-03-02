const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookCopy = require('../models/book-copy');

// Validates the data in the Add/Edit forms before submitting
function validateForm(formData) {

    if (!formData.title) {
        return 'The book\'s title must be included.';
    }
    else if (!formData.author) {
        return 'The book\'s author must be included.';
    }
    else if (!formData.isbn) {
        return 'The book\'s ISBN number must be included.';
    }
    else if (isNaN(formData.isbn) || formData.isbn.length !== 13) {
        return 'The book\'s ISBN number must contain only numeric values and be 13 digits.';
    }
    else if (!formData.summary) {
        return 'The book\'s summary must be included.';
    }
    else {
        return null;
    }
}

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

// Displays details for a specific book
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

// Displays new book form
exports.fetchBookCreateForm = (req, res, next) => {
    Promise.all([
        Author.find({}, 'name'),
        Genre.find({}, 'name')
    ]).then(([
        authors,
        genres
    ]) => {
        const results = {
            authors,
            genres
        };
        res.render('book-form', { page: 'Add New Book', data: { success: true, message: results }, errorMessage: null });
    }).catch(err => {
        res.render('book-form', { page: 'Add New Book', data: { success: false, message: 'Unable to load the Add New Book form at this time.' }, errorMessage: null });
    });
};

// Handles creation of a new book
exports.createNewBook = (req, res, next) => {
    const book = new Book({
        title: req.body.title.trim(),
        author: req.body.author,
        isbn: req.body.isbn.trim(),
        summary: req.body.summary.trim(),
        genre: req.body.genre
    });
    
    Promise.all([
        Author.find({}, 'name'),
        Genre.find({}, 'name')
    ]).then(([
        authors,
        genres
    ]) => {
        const results = {
            authors,
            genres,
            book
        };
        
        if (validateForm(book)) {
            res.render('book-form', { page: 'Add New Book', data: { success: true, message: results }, errorMessage: validateForm(book) });
        }
        else {
            book.save().then(data => {
                res.redirect(book.url);
            }).catch(err => {
                let errorMessage;
                
                if (err.code === 11000) {
                    errorMessage = `The ISBN number, "${book.isbn}", already exists in the catalog.`;
                }
                else {
                    errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
                }
                res.render('book-form', { page: 'Add New Book', data: { success: true, message: results }, errorMessage });
            });
        }
    }).catch(err => {
        res.render('book-form', { page: 'Add New Book', data: { success: false, message: 'Unable to add a new book at this time.' }, errorMessage: null });
    });
};

// Displays delete page for a specific book
exports.fetchBookDeleteForm = (req, res, next) => {  
    Promise.all([
        Book.findById(req.params.id),
        BookCopy.find({
            book: req.params.id
        })
    ]).then(([
        book,
        bookCopiesWithBook
    ]) => {
        const results = {
            book,
            bookCopiesWithBook
        };
  
        if (results.book === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('book-delete', { page: 'Delete Book', data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('book-delete', { page: 'Delete Book', data: { success: false, message: 'Unable to load the Delete Book form at this time.' } });
    });
};
  
// Handles deletion of a specific book
exports.deleteBook = (req, res, next) => {
    Promise.all([
        Book.findById(req.body.bookID),
        BookCopy.find({
            book: req.body.bookID
        })
    ]).then(([
        book,
        bookCopiesWithBook
    ]) => {
        const results = {
            book,
            bookCopiesWithBook
        };
  
        if (results.bookCopiesWithBook.length > 0) {
            res.render('book-delete', { page: 'Delete Book', data: { success: true, message: results } });
        }
        else {
            Book.findByIdAndRemove(req.body.bookID).then(data => {
                res.redirect('/catalog/books')
            }).catch(err => {
                res.render('book-delete', { page: 'Delete Book', data: { success: false, message: 'Unable to delete this book from the catalog at this time.' } });
            });
        }
    }).catch(err => {
        res.render('book-delete', { page: 'Delete Book', data: { success: false, message: 'Unable to load the Delete Book form at this time.' } });
    });
};

// Displays edit book form
exports.fetchBookUpdateForm = (req, res, next) => {
    Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre'),
        Author.find({}, 'name'),
        Genre.find({}, 'name')
    ]).then(([
        book,
        authors,
        genres
    ]) => {
        const results = {
            book,
            authors,
            genres
        };
        
        if (results.book === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('book-form', { page: 'Edit Book', data: { success: true, message: results }, errorMessage: null });
        }
    }).catch(err => {
        res.render('book-form', { page: 'Edit Book', data: { success: false, message: 'Unable to load the Edit Book form at this time.' }, errorMessage: null });
    });
};

// Handles update of a specific book
exports.updateBook = (req, res, next) => {
    const book = new Book({
        title: req.body.title.trim(),
        author: req.body.author,
        isbn: req.body.isbn.trim(),
        summary: req.body.summary.trim(),
        genre: req.body.genre,
        _id: req.params.id
    });
    
    Promise.all([
        Author.find({}, 'name'),
        Genre.find({}, 'name')
    ]).then(([
        authors,
        genres
    ]) => {
        const results = {
            authors,
            genres,
            book
        };
        
        if (validateForm(book)) {
            res.render('book-form', { page: 'Edit Book', data: { success: true, message: results }, errorMessage: validateForm(book) });
        }
        else {
            Book.findByIdAndUpdate(req.params.id, book).then(data => {
                res.redirect(data.url);
            }).catch(err => {
                let errorMessage;
                
                if (err.code === 11000) {
                    errorMessage = `The ISBN number, "${book.isbn}", already exists in the catalog.`;
                }
                else {
                    errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
                }
                res.render('book-form', { page: 'Edit Book', data: { success: true, message: results }, errorMessage });
            });
        }
    }).catch(err => {
        res.render('book-form', { page: 'Edit Book', data: { success: false, message: 'Unable to edit this book at this time.' }, errorMessage: null });
    });
};