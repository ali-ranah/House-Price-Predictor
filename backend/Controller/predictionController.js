const axios = require('axios');
const Prediction = require('../Model/predictionModel');

// Function to make a request to the Flask API to predict the price
const getPredictedPriceFromFlask = async (location, bedrooms, bathrooms, size) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/predict', {
            location,
            bedrooms,
            bathrooms,
            size
        });
        return response.data.predicted_price; // Return the predicted price from the Flask API
    } catch (error) {
        // Log the error for debugging
        console.error('Error making request to Flask API');

        // Check if the error response is 500
        if (error.response && error.response.status === 500) {
            throw new Error('Flask API returned a server error');
        }

        // For other errors, throw a generic error
        throw new Error('Error predicting price from Flask API');
    }
};

exports.predictPrice = async (req, res) => {
    const { location, size, bedrooms, bathrooms } = req.body;
    try {
        // Make request to Flask API to predict price
        const estimatedPrice = await getPredictedPriceFromFlask(location, bedrooms, bathrooms, size);

        // Check if the estimated price is returned
        if (estimatedPrice === undefined || estimatedPrice === null) {
            return res.status(404).json({ message: 'Price not found from Flask API' });
        }

        // Save prediction result to the database
        const prediction = new Prediction({
            location,
            size,
            bedrooms,
            bathrooms,
            estimatedPrice,
        });

        await prediction.save();
        res.status(201).json({ message: 'Price predicted successfully', prediction });
    } catch (error) {
        if (error.message === 'Flask API returned a server error') {
            return res.status(404).json({ message: 'Price not found for this location' });
        }
        res.status(500).json({ message: 'Error predicting price', error: error.message });
    }
};

const getLocationsFromFlask = async () => {
    try {
        // Request to Flask API to get the list of locations
        const response = await axios.get('http://127.0.0.1:5000/api/locations');
        return response.data;  // Return the locations from the Flask API
    } catch (error) {
        console.error('Error fetching locations from Flask API:', error);
        throw new Error('Error fetching locations from Flask API');
    }
};

// Controller to handle fetching locations
exports.getLocations = async (req, res) => {
    try {
        // Fetch the locations from the Flask API
        const locations = await getLocationsFromFlask();

        // If locations are fetched successfully, return them to the frontend
        res.status(200).json({ locations });
    } catch (error) {
        // If an error occurs, return an error message
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
    }
};