const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    dateListed: {
        type: Date,
        default: Date.now
    },
    isSold: {
        type: Boolean,
        default: false
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    parkingSpaces: {
        type: String,  // Number of parking spaces
        required: true
    },
    area: {
        type: String,  // Property area in square feet or meters
        required: true
    },
    furnished: {
        type: String,  // Whether the property is furnished or not
        required: true
    },
    condition: {
        type: String,  // Condition of the house (e.g., 'New', 'Renovated', 'Needs Work')
        required: true
    },
    gasAvailable: {
        type: String,  // Whether gas is available in the property
        required: true
    },
    additionalDetails: {
        type: String,  // Any extra details the owner wants to add
    },
    bids: [
        {
            buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            offerPrice: { type: Number },
            status: { type: String, default: 'pending' },  // Can be 'pending', 'accepted', 'rejected'
            placedAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Property', propertySchema);
