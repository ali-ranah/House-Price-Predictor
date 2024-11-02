const mongoose = require('mongoose');

const connectToDatabase = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    throw error;
  }
};

module.exports = { connectToDatabase };
