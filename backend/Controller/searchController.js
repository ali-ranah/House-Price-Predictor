const Property = require('../Model/propertyModel');

// Backend search API for properties
exports.Search = async (req, res) => {
    const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // Perform a case-insensitive search on multiple fields (title, description, location) and ensure `isSold` is false
    const properties = await Property.find({
      $and: [
        { isSold: false }, 
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    }).populate('owner', 'name email');

    if (properties.length === 0) {
      return res.status(200).json({ message: 'No properties found.', results: [] });
    }

    res.status(200).json({ results: properties });
  } catch (error) {
    console.error('Error during property search:', error);
    res.status(500).json({ message: 'An error occurred during the search.' });
  }
};
