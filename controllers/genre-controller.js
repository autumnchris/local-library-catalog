const Genre = require('../models/genre');
const Book = require('../models/book');

function validateForm(formData) {

    if (!formData.name) {
        return 'The genre name must be included.';
    }
    else if (formData.name.length > 100) {
        return 'The genre name must be no more than 100 characters.';
    }
    else {
        return null;
    }
}

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

        if (genreDetails === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('genre-detail', { page: {heading: 'Genre', details: genreDetails.name }, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('genre-detail', { data: { success: false, message: 'Unable to load the library catalog\'s details for this genre at this time.' } });
    });
};

// Displays new genre form
exports.fetchGenreCreateForm = (req, res, next) => {
    res.render('genre-form', { page: 'Add New Genre', data: null, errorMessage: null });
};

// Handles creation of a new genre
exports.createNewGenre = (req, res, next) => {
    const genre = new Genre({
        name: req.body.name.trim()
    });
    
    if (validateForm(genre)) {
        res.render('genre-form', { page: 'Add New Genre', data: { success: true, message: genre }, errorMessage: validateForm(genre) });
    }
    else {
        genre.save().then(data => {
            res.redirect(genre.url);
        }).catch(err => {
            let errorMessage;

            if (err.code === 11000) {
                errorMessage = `The genre name, "${genre.name}", already exists in the catalog.`;
            }
            else {
                errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
            }
            res.render('genre-form', { page: 'Add New Genre', data: { success: true, message: genre }, errorMessage });
        });
    }
};

// Displays delete page for a specific book
exports.fetchGenreDeleteForm = (req, res, next) => {    
    Promise.all([
        Genre.findById(req.params.id),
        Book.find({
            genre: req.params.id
        }).populate('author')
    ]).then(([
        genre,
        booksWithGenre
    ]) => {
        const results = {
            genre,
            booksWithGenre
        };
  
        if (genre === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('genre-delete', { page: { heading: 'Delete Genre', details: genre.name }, data: { success: true, message: results } });
        }
    }).catch(err => {
        res.render('genre-delete', { page: 'Delete Genre', data: { success: false, message: 'Unable to load the Delete Genre form at this time.' } });
    });
  };
  
  // Handles deletion of a specific genre
  exports.deleteGenre = (req, res, next) => {
    
    Promise.all([
        Genre.findById(req.body.genreID),
        Book.find({
            genre: req.body.genreID
        }).populate('author')
    ]).then(([
        genre,
        booksWithGenre
    ]) => {
        const results = {
            genre,
            booksWithGenre
        };
  
        if (booksWithGenre.length > 0) {
            res.render('genre-delete', { page: { heading: 'Delete Genre', details: genre.name }, data: { success: true, message: results } });
        }
        else {
            Genre.findByIdAndRemove(req.body.genreID).then(data => {
                res.redirect('/catalog/genres')
            }).catch(err => {
                res.render('genre-delete', { page: { heading: 'Delete Genre', details: genre.name }, data: { success: true, message: 'Unable to delete this genre from the catalog at this time.' } });
            });
        }
    }).catch(err => {
        res.render('genre-delete', { page: 'Delete Genre', data: { success: false, message: 'Unable to load the Delete Genre form at this time.' } });
    });
  };  

// Displays edit genre form
exports.fetchGenreUpdateForm = (req, res, next) => {
    Genre.findById(req.params.id).then(data => {

        if (data === null) {
            res.status(404).render('404', { page: 'Page not found' });
        }
        else {
            res.render('genre-form', { page: { heading: 'Edit Genre', details: data.name }, data: { success: true, message: data }, errorMessage: null });
        }
    }).catch(err => {
        res.render('genre-form', { page: 'Edit Genre', data: { success: false, message: 'Unable to load the Edit Genre form at this time.' }, errorMessage: null });
    });
};

// Handles update of a specific genre
exports.updateGenre = (req, res, next) => {
    const genre = new Genre({
        name: req.body.name.trim(),
        _id: req.params.id
    });

    Genre.findById(req.params.id, 'name').then(genreInfo => {
    
        if (validateForm(genre)) {
            res.render('genre-form', { page: { heading: 'Edit Genre', details: genreInfo.name }, data: { success: true, message: genre }, errorMessage: validateForm(genre) });
        }
        else {
            Genre.findByIdAndUpdate(req.params.id, genre).then(data => {
                res.redirect(data.url);
            }).catch(err => {
                let errorMessage;

                if (err.code === 11000) {
                    errorMessage = `The genre name, "${genre.name}", already exists in the catalog.`;
                }
                else {
                    errorMessage = 'Something went wrong. A form value might have been entered incorrectly. Please try again.';
                }
                res.render('genre-form', { page: { heading: 'Edit Genre', details: genreInfo.name }, data: { success: true, message: genre }, errorMessage });
            });
        }
    }).catch(err => {
        res.render('genre-form', { page: 'Edit Genre', data: { success: false, message: 'Unable to edit this genre at this time.' }, errorMessage: null });
    });
};