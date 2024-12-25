const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    dateListed: {
        type: Date,
        default: Date.now,
    },
    isSold: {
        type: Boolean,
        default: false,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    parkingSpaces: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    furnished: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    gasAvailable: {
        type: String,
        required: true,
    },
    additionalDetails: {
        type: String,
    },
    dateListed: {
        type: Date,
        default: Date.now,
    },    
    bids: [
        {
            buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            offerPrice: { type: Number },
            status: { type: String, default: 'pending' }, // Can be 'pending', 'accepted', 'rejected'
            placedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('Property', propertySchema);
