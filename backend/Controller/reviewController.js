const Review = require('../Model/reviewModel');

exports.addReview = async (req, res) => {
    const { propertyId, rating, comment } = req.body;
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
        const reviews = await Review.find({ propertyId: req.params.id }).populate('userId', 'name email');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reviews', error });
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
