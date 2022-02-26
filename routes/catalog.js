const express = require('express');
const bookController = require('../controllers/book-controller');
const authorController = require('../controllers/author-controller');
const router = express.Router();

// GET catalog count on homepage
router.get('/', bookController.fetchCatalogCount);

// BOOK ROUTES

// GET specific Book detail page
router.get('/book/:id', bookController.fetchBookDetail);

// GET list of all Book items
router.get('/books', bookController.fetchBookList);

// AUTHOR ROUTES

// GET list of all Author items
router.get('/authors', authorController.fetchAuthorList);

module.exports = router;