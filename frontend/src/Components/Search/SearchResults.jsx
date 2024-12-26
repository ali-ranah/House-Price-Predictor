import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Spinner } from "@material-tailwind/react";
import { FaTimes } from 'react-icons/fa';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

const fetchResults = useCallback(async (query, locationState) => {
    if (locationState && locationState.results) {
      setResults(locationState.results);
      setLoading(false);
    } else if (query && query.trim()) { // Check if query is not empty or just spaces
      try {
        const response = await AxiosRequest.get(`/api/search/search?query=${query}`);
        setResults(response.data.results);
      } catch (error) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setLoading(false);
    }
  }, []); 
  
  useEffect(() => {
    fetchResults(query, location.state);
  }, [query, location.state, fetchResults]);
  

  const handleOpenDialog = (property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProperty(null);
  };


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {loading ? (
            <div className="flex justify-center items-center min-h-[70vh]">
              <Spinner className="h-16 w-16 text-blue-600" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex justify-center items-center min-h-[70vh]">
             No properties found.
            </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {results.map((property) => (
        <Card key={property._id} className="w-full max-w-[26rem] shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
           <CardHeader floated={false}>
             <img
               src={property.imageUrl || 'default-image.jpg'} // Use a default image if imageUrl is missing
               alt={property.title}
               className="w-full h-48 object-cover"
             />
             <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
           </CardHeader>
              <CardBody>
                <Typography variant="small" color="gray">{new Date(property.dateListed).toLocaleDateString()}</Typography>
                <div className="mb-3 flex items-center justify-between">
                  <Typography variant="h5" color="blue-gray" className="font-medium">{property.title}</Typography>
                  <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal">{property.price} PKR</Typography>
                </div>
                <Typography color="gray">{property.description}</Typography>
              </CardBody>
              <CardFooter className="pt-0 flex items-center justify-center">
                <Button size="sm" color="blue" className="text-white shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md" onClick={() => handleOpenDialog(property)}>
                Read More
              </Button>
            </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for property details */}
      {selectedProperty && (
        <Dialog open={open} handler={handleCloseDialog} className="max-w-lg">
          <DialogHeader className="relative">
            <Typography variant='h4' className='text-center w-full'>{selectedProperty.title}</Typography>
            <div className='absolute top-4 right-4'>
              <FaTimes size={20} color="red" className="cursor-pointer" onClick={handleCloseDialog} />
            </div>
          </DialogHeader>
          <DialogBody divider className="overflow-y-auto max-h-96 dashboard-1-scrollbar">
            <img src={selectedProperty.imageUrl || 'default-image.jpg'} alt={selectedProperty.title} className="w-full h-48 object-cover mb-4" />
            <Typography variant="small" color="blue-gray" className="font-medium">Price: {selectedProperty.price} PKR</Typography>
            <Typography color="gray" className="mt-2">Owner: {selectedProperty.owner.name}</Typography>
            <Typography color="gray" className="mt-2">Location: {selectedProperty.location}</Typography>
            <Typography color="gray" className="mt-2">Bedrooms: {selectedProperty.bedrooms}</Typography>
            <Typography color="gray" className="mt-2">Bathrooms: {selectedProperty.bathrooms}</Typography>
            <Typography color="gray" className="mt-2">Parking Spaces: {selectedProperty.parkingSpaces}</Typography>
            <Typography color="gray" className="mt-2">Area: {selectedProperty.area}</Typography>
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
};

export default SearchResults;
