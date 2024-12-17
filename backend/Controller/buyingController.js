const Property = require('../Model/propertyModel');
const sendEmail = require('../utils/emailUtils');

// Place a bid on a property
exports.placeBid = async (req, res) => {
    const { offerPrice } = req.body;
    const propertyId = req.params.id;
    const buyerId = req.user.userId;
    console.log('OfferPrice', offerPrice);
    console.log('PropertyId', propertyId);
    console.log('BuyerId', buyerId);

    try {
        const property = await Property.findById(propertyId).populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const bid = { buyer: buyerId, offerPrice, status: 'pending' };
        property.bids.push(bid);
        await property.save();
         // Send notification email to the property owner
         await sendEmail({
            email: property.owner.email,
            subject: 'New Bid on Your Property',
            type: 'bid_notification',
            name: property.owner.name,
            offerPrice: offerPrice,
        });

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


exports.acceptOffer = async (req, res) => {
    const { bidId } = req.body;
    const propertyId = req.params.id;
    const ownerId = req.user.userId;

    try {
        // Find the property owned by the user
        const property = await Property.findOne({ _id: propertyId, owner: ownerId }).populate('bids.buyer', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        // Find the bid to accept
        const bid = property.bids.id(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Update all bids to rejected and set the accepted bid
        property.bids.forEach(b => {
            if (b._id.toString() === bidId) {
                b.status = 'accepted'; // Accept this bid
            } else {
                b.status = 'rejected'; // Reject all other bids
            }
        });

        // Mark the property as sold and assign buyer
        property.isSold = true;
        property.buyer = bid.buyer;

        // Save the updated property
        await property.save();

        // Notify the buyer via email
        await sendEmail({
            email: bid.buyer.email,
            subject: 'Offer Accepted',
            type: 'offerAccepted',
            name: bid.buyer.name,
        });

        res.status(200).json({ message: 'Offer accepted, property sold', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept offer', error });
    }
};


// Reject an offer on a property
exports.rejectOffer = async (req, res) => {
    const { bidId } = req.body;
    const propertyId = req.params.id;
    const ownerId = req.user.userId;

    try {
        const property = await Property.findOne({ _id: propertyId, owner: ownerId }).populate('bids.buyer', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        const bid = property.bids.id(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        bid.status = 'rejected';

        await property.save();
        await sendEmail({
            email: bid.buyer.email,
            subject: 'Offer Rejected',
            type: 'offerRejected',
            name: bid.buyer.name,
        });

        res.status(200).json({ message: 'Offer rejected', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject offer', error });
    }
};


// Get all properties the user has bidded on
exports.getUserBids = async (req, res) => {
    const buyerId = req.user.userId;

    try {
        // Find properties where the bids array includes a bid from the buyer
        const properties = await Property.find({
            'bids.buyer': buyerId
        }).populate('bids.buyer', 'name email'); // Optional: populate buyer details if needed

        if (properties.length === 0) {
            return res.status(404).json({ message: 'No bids found for this user.' });
        }

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user bids', error });
    }
};
