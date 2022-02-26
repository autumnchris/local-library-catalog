const express = require('express');
const bookController = require('../controllers/book-controller');
const authorController = require('../controllers/author-controller');
const bookCopyController = require('../controllers/book-copy-controller');
const router = express.Router();

// GET catalog count on homepage
router.get('/', bookController.fetchCatalogCount);

// BOOK ROUTES

// GET specific Book detail page
router.get('/book/:id', bookController.fetchBookDetail);

// GET list of all Book items
router.get('/books', bookController.fetchBookList);

// AUTHOR ROUTES

// GET specific Author detail page
router.get('/author/:id', authorController.fetchAuthorDetail);

// GET list of all Author items
router.get('/authors', authorController.fetchAuthorList);

// BOOK COPY ROUTES

// GET specific Book Copy detail page
router.get('/book-copy/:id', bookCopyController.fetchBookCopyDetail);

// GET list of all Book Copy items
router.get('/book-copies', bookCopyController.fetchBookCopyList);

module.exports = router;