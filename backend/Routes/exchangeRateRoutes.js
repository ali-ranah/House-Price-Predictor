const express = require('express');
const exchangeRateController = require('../Controller/exchangerateController');
const authMiddleware = require('../Middleware/AuthMiddleware/AuthMiddleware'); 

const router = express.Router();

// Get exchange rate between base currency and target currency
router.get('/exchange-rate', exchangeRateController.getExchangeRate);

module.exports = router;
