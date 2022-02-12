const express = require('express');
const bookController = require('../controllers/book-controller');
const router = express.Router();

// GET catalog count on home page.
router.get('/', bookController.fetchCatalogCount);

module.exports = router;
