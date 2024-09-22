const Property = require('../Model/propertyModel');

// List a property for sale
exports.listPropertyForSale = async (req, res) => {
    const {
        title,
        description,
        price,
        location,
        imageUrl,
        bedrooms,
        bathrooms,
        parkingSpaces,
        area,
        furnished,
        condition,
        gasAvailable,
        additionalDetails
    } = req.body;
    const ownerId = req.user.userId;

    try {
        const property = new Property({
            owner: ownerId,
            title,
            description,
            price,
            location,
            imageUrl,
            bedrooms,
            bathrooms,
            parkingSpaces,
            area,
            furnished,
            condition,
            gasAvailable,
            additionalDetails
        });

        await property.save();
        res.status(201).json({ message: 'Property listed successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to list property', error });
    }
};

// Edit a property listing
exports.editPropertyListing = async (req, res) => {
    const {
        title,
        description,
        price,
        location,
        imageUrl,
        bedrooms,
        bathrooms,
        parkingSpaces,
        area,
        furnished,
        condition,
        gasAvailable,
        additionalDetails
    } = req.body;
    const propertyId = req.params.id;
    const ownerId = req.user.userId;

    try {
        const property = await Property.findOne({ _id: propertyId, owner: ownerId });
        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        property.title = title || property.title;
        property.description = description || property.description;
        property.price = price || property.price;
        property.location = location || property.location;
        property.imageUrl = imageUrl || property.imageUrl;
        property.bedrooms = bedrooms || property.bedrooms;
        property.bathrooms = bathrooms || property.bathrooms;
        property.parkingSpaces = parkingSpaces || property.parkingSpaces;
        property.area = area || property.area;
        property.furnished = furnished || property.furnished;
        property.condition = condition || property.condition;
        property.gasAvailable = gasAvailable || property.gasAvailable;
        property.additionalDetails = additionalDetails || property.additionalDetails;

        await property.save();
        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update property', error });
    }
};

// Close a property listing
exports.closeListing = async (req, res) => {
    const propertyId = req.params.id;
    const ownerId = req.user.userId;

    try {
        const property = await Property.findOne({ _id: propertyId, owner: ownerId });
        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        property.isSold = true;
        await property.save();
        res.status(200).json({ message: 'Property listing closed', property });
    } catch (error) {
        res.status(500).json({ message: 'Failed to close listing', error });
    }
};

// Fetch properties listed by the user
exports.getUserProperties = async (req, res) => {
    const ownerId = req.user.userId;

    try {
        const properties = await Property.find({ owner: ownerId });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties', error });
    }
};
