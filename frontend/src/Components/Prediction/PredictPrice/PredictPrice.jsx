import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {Input} from '@/Components/ui/input'; 
import { Spinner } from '@material-tailwind/react'; // Adjust path as needed
import AxiosRequest from '../../AxiosRequest/AxiosRequest'
import toast from 'react-hot-toast';

const PredictPrice = () => {
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);

  const handlePredict = async () => {
    if(!location){
    toast.error('Please provide your required house location');
    return;
    }
    if(!size){
    toast.error('Please provide your required house size');
    return;
    }
    if(!bedrooms){
     toast.error('Please provide your required bedrooms in house');
     return;
    }
    if(!bathrooms){
    toast.error('Please provide your required bathrooms in house');
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
    <div className="flex items-center justify-center min-h-screen bg-[#FEF9F2]">
      <Card className="p-8 w-full max-w-md shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">House Price Prediction</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mb-4"
            />
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
    </div>
  );
};

export default PredictPrice;
