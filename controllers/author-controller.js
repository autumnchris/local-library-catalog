const validator = require('validator');
const Author = require('../models/author');
const Book = require('../models/book');

function validateForm(formData, dateOfBirth, dateOfDeath) {

    if (!formData.name) {
        return 'The author\'s name must be included.';
    }
    else if (formData.name.length > 300) {
        return 'The author\'s name must be no more than 300 characters.';
    }
    else if (formData.dateOfBirth && !validator.isDate(dateOfBirth, { format: 'YYYY-MM-DD', strictMode: true })) {
        return 'The author\'s date of birth is not in a recognized format.';
    }
    else if (validator.isAfter(dateOfBirth)) {
        return 'The author\'s date of birth cannot be set after today\'s date.';
    }
    else if (formData.dateOfDeath && !validator.isDate(dateOfDeath, { format: 'YYYY-MM-DD', strictMode: true })) {
        return 'The author\'s date of death is not in a recognized format.';
    }
    else if (validator.isAfter(dateOfDeath)) {
        return 'The author\'s date of death cannot be set after today\'s date.';
    }
    else if (validator.isAfter(dateOfBirth, dateOfDeath)) {
        return 'The author\'s date of death cannot be set before the author\'s date of birth.';
    }
    else {
        return null;
    }
}

// Displays list of all the authors in the catalog
exports.fetchAuthorList = (req, res, next) => {
    Author.find().sort({
        name: 'asc'
    }).then(data => {
        res.render('author-list', { page: { heading: 'All Authors' }, data: { success: true, message: data } });
    }).catch(err => {
        res.render('author-list', { page: { heading: 'All Authors' }, data: { success: false, message: 'Unable to load the library catalog\'s author list at this time.' } });
    });
};

// Displays details for a specific author
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

        if (authorDetails === null) {
            res.status(404).render('404', { page: { heading: 'Page not found' } });
        }
        else {
            res.render('author-detail', { page: { heading: 'Author', details: authorDetails.name }, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('author-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this author at this time.' } });
    });
};

// Displays new author form
exports.fetchAuthorCreateForm = (req, res, next) => {
    res.render('author-form', { page: { heading: 'Add New Author' } });
};

// Handles creation of a new author
exports.createNewAuthor = (req, res, next) => {
    const author = new Author({
        name: req.body.name.trim(),
        dateOfBirth: req.body.dateOfBirth.trim(),
        dateOfDeath: req.body.dateOfDeath.trim()
    });

    if (validateForm(author, req.body.dateOfBirth.trim(), req.body.dateOfDeath.trim())) {
        res.render('author-form', { page: { heading: 'Add New Author' }, data: { success: true, message: author }, errorMessage: validateForm(author, req.body.dateOfBirth.trim(), req.body.dateOfDeath.trim()) });
    }
    else {
        author.save().then(data => {
            res.redirect(author.url);
        }).catch(err => {
            let errorMessage;

            if (err.code === 11000) {
                errorMessage = `The author, "${author.name}", already exists in the catalog.`;
            }
            else {
                errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
            }
            res.render('author-form', { page: { heading: 'Add New Author' }, data: { success: true, message: author }, errorMessage });
        });
    }
};

// Displays delete page for a specific author
exports.fetchAuthorDeleteForm = (req, res, next) => {
    Promise.all([
        Author.findById(req.params.id),
        Book.find({
            author: req.params.id
        })
    ]).then(([
        author,
        booksWithAuthor
    ]) => {
        const results = {
            author,
            booksWithAuthor
        };
  
        if (author === null) {
            res.status(404).render('404', { page: { heading: 'Page not found' } });
        }
        else {
            res.render('author-delete', { page: { heading: 'Delete Author', details: author.name }, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('author-delete', { page: { heading: 'Delete Author' }, data: { success: false, message: 'Unable to load the Delete Author form at this time.' } });
    });
};

// Handles deletion of a specific author
exports.deleteAuthor = (req, res, next) => {
    Promise.all([
        Author.findById(req.body.authorID),
        Book.find({
            author: req.body.authorID
        })
    ]).then(([
        author,
        booksWithAuthor
    ]) => {
        const results = {
            author,
            booksWithAuthor
        };
  
        if (booksWithAuthor.length > 0) {
            res.render('author-delete', { page: { heading: 'Delete Author', details: author.name }, data: { success: true, message: results } });
        }
        else {
            Author.findByIdAndRemove(req.body.authorID).then(data => {
                res.redirect('/catalog/authors');
            }).catch(err => {
                res.render('author-delete', { page: { heading: 'Delete Author', details: author.name }, data: { success: false, message: 'Unable to delete this author from the catalog at this time.' } });
            });
        }
    }).catch(err => {
        res.render('author-delete', { page: { heading: 'Delete Author' }, data: { success: false, message: 'Unable to load the Delete Author form at this time.' } });
    });
  };

// Displays edit author form
exports.fetchAuthorUpdateForm = (req, res, next) => {
    Author.findById(req.params.id).then(data => {

        if (data === null) {
            res.status(404).render('404', { page: { heading: 'Page not found' } });
        }
        else {
            res.render('author-form', { page: { heading: 'Edit Author', details: data.name }, data: { success: true, message: data } });
        }
    }).catch(err => {
        res.render('author-form', { page: { heading: 'Edit Author' }, data: { success: false, message: 'Unable to load the Edit Author form at this time.' } });
    });
};

// Handles update of a specific author
exports.updateAuthor = (req, res, next) => {
    const author = new Author({
        name: req.body.name.trim(),
        dateOfBirth: req.body.dateOfBirth.trim(),
        dateOfDeath: req.body.dateOfDeath.trim(),
        _id: req.params.id
    });

    Author.findById(req.params.id, 'name').then(authorInfo => {

        if (validateForm(author, req.body.dateOfBirth.trim(), req.body.dateOfDeath.trim())) {
            res.render('author-form', { page: { heading: 'Edit Author', details: authorInfo.name }, data: { success: true, message: author }, errorMessage: validateForm(author, req.body.dateOfBirth.trim(), req.body.dateOfDeath.trim()) });
        }
        else {
            Author.findByIdAndUpdate(req.params.id, author).then(data => {
                res.redirect(data.url);
            }).catch(err => {
                let errorMessage;
    
                if (err.code === 11000) {
                    errorMessage = `The author, "${author.name}", already exists in the catalog.`;
                }
                else {
                    errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
                }
                res.render('author-form', { page: { heading: 'Edit Author', details: authorInfo.name }, data: { success: true, message: author }, errorMessage });
            });
        }
    }).catch(err => {
        res.render('author-form', { page: { heading: 'Edit Author' }, data: { success: false, message: 'Unable to edit this author at this time.' } });
    });
};