const Property = require('../Model/propertyModel');
const Review = require('../Model/reviewModel')

// Get all properties 
exports.getAllProperties = async (req, res) => {
    try {
        // Find all unsold properties
        const properties = await Property.find({ isSold: false }).populate('owner', 'name email').populate('bids.buyer', 'name email');
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving properties', error });
    }
};

exports.getPropertiesWithBidOption = async (req, res) => {
    const userId = req.user._id;
    try {
        // Fetch properties and populate owner information
        const properties = await Property.find({ isSold: false })
            .populate('owner', 'name email');

        // Filter properties to determine bid option availability
        const propertiesWithBidOption = properties.map(property => {
            const isOwner = property.owner._id.toString() === userId;
            return {
                ...property.toObject(),
                canBid: !isOwner  // Add a `canBid` property based on ownership
            };
        });
console.log('Properties with bid option ' , propertiesWithBidOption);
        res.status(200).json(propertiesWithBidOption);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving properties with bid option', error });
    }
};


// Get a specific property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving property', error });
    }
};

// Create a property (for owner use)
exports.createProperty = async (req, res) => {
    const { title, description, price, location, imageUrl } = req.body;
    const owner =  req.user.userId;

    try {
        const property = new Property({
            title,
            description,
            price,
            location,
            imageUrl,
            owner  // Owner is typically the one creating it
        });
        await property.save();
        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error });
    }
};

// Update a property by ID (for owner)
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error });
    }
};

// Delete a property by ID (for owner)
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        await Review.deleteMany({ propertyId: req.params.id });
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
};
