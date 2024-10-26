const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectToDatabase } = require('./databaseController');
const routes = require('./Routes/routes');
const buynsellingRoutes = require('./Routes/BuyingAndSellingRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const exchangeRoutes = require('./Routes/exchangeRateRoutes');
const propertyRoutes = require('./Routes/propertyRoutes');
const predictRoutes = require('./Routes/predictRoutes');

require("dotenv").config();

// Initialize Express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

const primaryUrl = process.env.MONGO_URI_SRV;
const fallbackUrl = process.env.MONGO_URI_WITHOUT_SRV;

const connectWithFallback = async (primaryUrl, fallbackUrl) => {
  console.log('Trying to connect to the primary MongoDB...');
  try {
    await connectToDatabase(primaryUrl);
    console.log('Connected to the primary MongoDB');
  } catch (error) {
    console.error('Failed to connect to the primary MongoDB:');
    console.log('Trying to connect to the fallback MongoDB...');
    try {
      await connectToDatabase(fallbackUrl);
      console.log('Connected to the fallback MongoDB');
    } catch (fallbackError) {
      console.error('Failed to connect to the fallback MongoDB:');
      throw fallbackError;
    }
  }
};

connectWithFallback(primaryUrl, fallbackUrl).catch((error) => {
  console.error('Failed to connect to any MongoDB instance:', error);
  process.exit(1); // Exit the process with an error code
});

app.get('/', (req, res) => {
  res.send('Welcome to your application');
});

app.use('/api', routes);
app.use('/api/bns', buynsellingRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/predict', predictRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});