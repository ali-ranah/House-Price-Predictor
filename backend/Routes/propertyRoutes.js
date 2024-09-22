const express = require('express');
const propertyController = require('../Controller/propertyController');
const authMiddleware  = require('../Middleware/AuthMiddleware/AuthMiddleware'); // Assuming you have an authentication middleware

const router = express.Router();

// Get all available properties (for public viewing)
router.get('/properties', propertyController.getAllProperties);

// Get a specific property by ID
router.get('/property/:id', propertyController.getPropertyById);

// Create a new property (for authenticated users who can list properties)
router.post('/property', authMiddleware, propertyController.createProperty);

// Update a property by ID (owner can update)
router.put('/property/:id', authMiddleware, propertyController.updateProperty);

// Delete a property by ID (owner can delete)
router.delete('/property/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
