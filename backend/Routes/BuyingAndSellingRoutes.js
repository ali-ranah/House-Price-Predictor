const express = require('express');
const sellingController = require('../Controller/sellingController');
const buyingController = require('../Controller/buyingController');
const authMiddleware = require('../Middleware/AuthMiddleware/AuthMiddleware'); // Assuming you have middleware

const router = express.Router();

// Selling Routes
router.post('/property', authMiddleware, sellingController.listPropertyForSale);
router.put('/property/:id', authMiddleware, sellingController.editPropertyListing);
router.delete('/property/:id', authMiddleware, sellingController.closeListing);
router.get('/user/properties', authMiddleware, sellingController.getUserProperties);

// Buying Routes
router.post('/property/:id/bid', authMiddleware, buyingController.placeBid);
router.put('/property/:id/bid/withdraw', authMiddleware, buyingController.withdrawBid);
router.post('/property/:id/bid/accept', authMiddleware, buyingController.acceptOffer);

module.exports = router;
