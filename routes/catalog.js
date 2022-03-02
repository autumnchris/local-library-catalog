const express = require('express');
const bookController = require('../controllers/book-controller');
const authorController = require('../controllers/author-controller');
const genreController = require('../controllers/genre-controller');
const bookCopyController = require('../controllers/book-copy-controller');
const router = express.Router();

// GET catalog count on homepage
router.get('/', bookController.fetchCatalogCount);

// BOOK ROUTES

// GET form for creating Book
router.get('/book/create', bookController.fetchBookCreateForm);

// POST created Book to database
router.post('/book/create', bookController.createNewBook);

// GET page for deleting Book
router.get('/book/:id/delete', bookController.fetchBookDeleteForm);

// POST deleted Book to database
router.post('/book/:id/delete', bookController.deleteBook);

// GET form for updating Book
router.get('/book/:id/update', bookController.fetchBookUpdateForm);

// POST updated Book to database
router.post('/book/:id/update', bookController.updateBook);

// GET specific Book detail page
router.get('/book/:id', bookController.fetchBookDetail);

// GET list of all Book items
router.get('/books', bookController.fetchBookList);

// AUTHOR ROUTES

// GET form for creating Author
router.get('/author/create', authorController.fetchAuthorCreateForm);

// POST created Author to database
router.post('/author/create', authorController.createNewAuthor);

// GET form for updating Author
router.get('/author/:id/update', authorController.fetchAuthorUpdateForm);

// POST updated Author to database
router.post('/author/:id/update', authorController.updateAuthor);

// GET specific Author detail page
router.get('/author/:id', authorController.fetchAuthorDetail);

// GET list of all Author items
router.get('/authors', authorController.fetchAuthorList);

// GENRE ROUTES

// GET form for creating Genre
router.get('/genre/create', genreController.fetchGenreCreateForm);

// POST created Genre to database
router.post('/genre/create', genreController.createNewGenre);

// GET form for updating Genre
router.get('/genre/:id/update', genreController.fetchGenreUpdateForm);

// POST updated Genre to database
router.post('/genre/:id/update', genreController.updateGenre);

// GET specific Genre detail page
router.get('/genre/:id', genreController.fetchGenreDetail);

// GET list of all Genre items
router.get('/genres', genreController.fetchGenreList);

// BOOK COPY ROUTES

// GET form for creating Book Copy
router.get('/book-copy/create', bookCopyController.fetchBookCopyCreateForm);

// POST created Book Copy to database
router.post('/book-copy/create', bookCopyController.createNewBookCopy);

// GET form for updating Book Copy
router.get('/book-copy/:id/update', bookCopyController.fetchBookCopyUpdateForm);

// POST updated Book Copy to database
router.post('/book-copy/:id/update', bookCopyController.updateBookCopy);

// GET specific Book Copy detail page
router.get('/book-copy/:id', bookCopyController.fetchBookCopyDetail);

// GET list of all Book Copy items
router.get('/book-copies', bookCopyController.fetchBookCopyList);

module.exports = router;