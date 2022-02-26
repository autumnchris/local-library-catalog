const express = require('express');
const bookController = require('../controllers/book-controller');
const router = express.Router();

// GET catalog count on homepage
router.get('/', bookController.fetchCatalogCount);

// BOOK ROUTES

// GET list of all Book items
router.get('/books', bookController.fetchBookList);

module.exports = router;
