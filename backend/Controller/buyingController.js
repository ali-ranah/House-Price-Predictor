const Property = require('../Model/propertyModel');

// Place a bid on a property
exports.placeBid = async (req, res) => {
    const { offerPrice } = req.body;
    const propertyId = req.params.id;
    const buyerId = req.user.userId;

    try {
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const bid = { buyer: buyerId, offerPrice, status: 'pending' };
        property.bids.push(bid);
        await property.save();

        res.status(201).json({ message: 'Bid placed successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place bid', error });
    }
};

// Withdraw a bid
exports.withdrawBid = async (req, res) => {
    const propertyId = req.params.id;
    const buyerId = req.user.userId;

    try {
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        property.bids = property.bids.filter(bid => bid.buyer.toString() !== buyerId);
        await property.save();

        res.status(200).json({ message: 'Bid withdrawn successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to withdraw bid', error });
    }
};

// Accept an offer on a property
exports.acceptOffer = async (req, res) => {
    const { bidId } = req.body;
    const propertyId = req.params.id;
    const ownerId = req.user.userId;

    try {
        const property = await Property.findOne({ _id: propertyId, owner: ownerId });
        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        const bid = property.bids.id(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        bid.status = 'accepted';
        property.isSold = true;

        await property.save();
        res.status(200).json({ message: 'Offer accepted, property sold', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept offer', error });
    }
};
