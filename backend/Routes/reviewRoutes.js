const express = require('express');
const reviewController = require('../Controller/reviewController');
const  authMiddleware  = require('../Middleware/AuthMiddleware/AuthMiddleware'); // Assuming you have authentication middleware

const router = express.Router();

// Add a review for a property
router.post('/property/:id/review', authMiddleware, reviewController.addReview);

// Get all reviews for a property
router.get('/property/:id/reviews', reviewController.getReviewsForProperty);

router.get('/property/own_reviews',authMiddleware, reviewController.getUserReviews);

// Delete a review (only the user who posted it can delete)
router.delete('/review/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
