const Review = require('../Model/reviewModel');

exports.addReview = async (req, res) => {
    const {rating, comment } = req.body;
    const propertyId = req.params.id
    const userId =  req.user.userId;
    try {
        const review = new Review({ propertyId, userId, rating, comment });
        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

exports.getReviewsForProperty = async (req, res) => {
    try {
        console.log('PropertyId', req.params.id);
        const reviews = await Review.find({ propertyId: req.params.id }).populate('userId', 'name email');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviews', error });
    }
};

// Get all reviews by the logged-in user
exports.getUserReviews = async (req, res) => {
    const userId = req.user.userId;

    try {
        const reviews = await Review.find({ userId }).populate('propertyId', 'title location'); // Populate property details if needed

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user reviews', error });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};
