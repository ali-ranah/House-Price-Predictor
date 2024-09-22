const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    location: { type: String, required: true },
    size: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
