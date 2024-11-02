const express = require('express');
const sellingController = require('../Controller/sellingController');
const buyingController = require('../Controller/buyingController');
const authMiddleware = require('../Middleware/AuthMiddleware/AuthMiddleware'); // Assuming you have middleware
const multer = require('multer');

const router = express.Router();

// Set up Multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory as buffer
const upload = multer({ storage });

// Selling Routes
router.post('/property', authMiddleware, upload.single('image'), sellingController.listPropertyForSale);
router.put('/property/:id', authMiddleware, sellingController.editPropertyListing);
router.delete('/property/:id', authMiddleware, sellingController.closeListing);
router.get('/user/properties', authMiddleware, sellingController.getUserProperties);

// Buying Routes
router.post('/property/:id/bid', authMiddleware, buyingController.placeBid);
router.put('/property/:id/bid/withdraw', authMiddleware, buyingController.withdrawBid);
router.patch('/property/:id/bid/accept', authMiddleware, buyingController.acceptOffer);
router.patch('/property/:id/bid/reject', authMiddleware, buyingController.rejectOffer);
router.get('/user/bids',authMiddleware, buyingController.getUserBids); // New route for getting user's bids

module.exports = router;
