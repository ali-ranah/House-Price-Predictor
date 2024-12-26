import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {Input} from '@/Components/ui/input'; 
import { Spinner, Typography } from '@material-tailwind/react'; // Adjust path as needed
import AxiosRequest from '../../AxiosRequest/AxiosRequest'
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const PredictPrice = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);


  useEffect(() => {
    // Fetch the locations from the backend API when the component mounts
    const fetchLocations = async () => {
      try {
        const response = await AxiosRequest.get('/api/predict/get-locations');
        setLocations(response.data.locations);
      } catch (error) {
        toast.error('Error fetching locations');
      }
    };

    fetchLocations();
  }, []);


  const handlePredict = async () => {
    // Validate the location
    if (!location) {
      toast.error('Please provide your required house location');
      return;
    }
    // Validate size, bedrooms, and bathrooms
    if (!size) {
      toast.error('Please provide your required house size');
      return;
    }
    if (!bedrooms) {
      toast.error('Please provide your required bedrooms in house');
      return;
    }
    if (!bathrooms) {
      toast.error('Please provide your required bathrooms in house');
      return;
    }
  
    // maximum values in the model
    const maxValues = {
      max_bedrooms: 16,  
      max_bathrooms: 14, 
      max_area: 338798790, 
    };
  
    // Validate that the inputs do not exceed the maximum values
    if (Number(bedrooms) > maxValues.max_bedrooms) {
      toast.error(`Bedrooms cannot exceed ${maxValues.max_bedrooms}`);
      return;
    }
    if (Number(bathrooms) > maxValues.max_bathrooms) {
      toast.error(`Bathrooms cannot exceed ${maxValues.max_bathrooms}`);
      return;
    }
    if (Number(size) > maxValues.max_area) {
      toast.error(`Area cannot exceed ${maxValues.max_area}`);
      return;
    }
  
    setLoading(true);
    try {
      const response = await AxiosRequest.post('/api/predict/predict-price', {
        location,
        size: Number(size),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
      });
  
      setPredictedPrice(response.data.prediction.estimatedPrice);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const formatPrice = (price) => {
    return `PKR ${new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(price)}`;
};

const handleNumericInputChange = (setter) => (e) => {
  const value = e.target.value;
  // Ensure value is a valid number or empty
  if (value === '' || (Number(value) > 0 && /^\d+(\.\d+)?$/.test(value))) {
    setter(value);
  }
};

  return (
   <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
    <div className="flex items-start justify-center min-h-screen">
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full p-6"
      >
      <Card className="p-8 w-full max-w-md shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
        <CardHeader>
      <Typography variant="h4" className="text-center py-4 text-gray-800 font-semibold">
            House Price Prediction
        </Typography>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mb-4"
            /> */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mb-4 w-full p-2 border rounded-md"
            >
              <option value="">Select Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Size (sq ft)"
              value={size}
              onChange={handleNumericInputChange(setSize)}
              className="mb-4"
            />
            <Input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={handleNumericInputChange(setBedrooms)}
              className="mb-4"
            />
            <Input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={handleNumericInputChange(setBathrooms)}
              className="mb-4"
            />
          </div>
        <div className='flex items-center justify-center'>
          <Button
            onClick={handlePredict}
            variant="default"
            disabled={loading}
            className='mt-4'
          >
            {loading ? <Spinner size="sm" color="white" /> : 'Predict Price'}
          </Button>
          </div>
          {predictedPrice !== null && !loading && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold">Estimated Price:</h3>
              <p className="text-2xl text-green-500 font-semibold">
                {formatPrice(predictedPrice)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
    </div>
  );
};

export default PredictPrice;
