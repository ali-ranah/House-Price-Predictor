const express = require('express');
const router = express.Router();
const predictionController = require('../Controller/predictionController');

// Route for predicting price
router.post('/predict-price', predictionController.predictPrice);
router.get('/get-locations', predictionController.getLocations);

module.exports = router;
