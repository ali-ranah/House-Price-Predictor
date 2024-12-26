const express = require('express');
const searchController = require('../Controller/searchController');

const router = express.Router();

// Add a review for a property
router.get('/search', searchController.Search);


module.exports = router;
