import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { FaTimes } from 'react-icons/fa';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';

const BookingCard = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [openBidDialog, setOpenBidDialog] = useState(false); // State for bid dialog
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyForBid, setSelectedPropertyForBid] = useState(null);
  const [offerPrice, setOfferPrice] = useState(''); // State for the offer price
  const token = useSelector(selectToken) || localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [loading,setLoading] = useState(false);


    const fetchProperties = async () => {
      try {
        const response = await AxiosRequest.get('/api/property/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

  useEffect(() => {  
    fetchProperties();
  }, []);

  const handleOpenDialog = (property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleOpenBidDialog = (property) => {
    setSelectedPropertyForBid(property);
    setOpenBidDialog(true);
  };

  const handleCloseBidDialog = () => {
    setSelectedPropertyForBid(null);
    setOpenBidDialog(false);
    setOfferPrice(''); 
  };

  const handleChange = (e) => {
    const { value } = e.target;
  
    // Check if the value is empty or a valid number (integer or decimal)
    if (value === '' || (Number(value) > 0 && /^\d+(\.\d+)?$/.test(value))) {
      setOfferPrice(value);
    }
  };
  


  const handleBidSubmit = async () => {
    if (!offerPrice || isNaN(offerPrice) || offerPrice <= 0) {
      handleCloseBidDialog();
      toast.error("Please enter a valid bid amount.");
      return;
    }
  
    try {
      setLoading(true);
      await AxiosRequest.post(`/api/bns/property/${selectedPropertyForBid._id}/bid`, {
        offerPrice: Number(offerPrice),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Bid placed successfully!");
      handleCloseBidDialog();
      fetchProperties();
    } catch (error) {
      // Improved error logging
      if (error.response) {
        console.error('Error placing bid:', {
          message: error.message,
          status: error.response.status,
          data: error.response.data,
        });
        toast.error(`Failed to place bid: ${error.response.data.message || "Please try again."}`);
      } else if (error.request) {
        console.error('Error placing bid: No response received', {
          message: error.message,
          request: error.request,
        });
        toast.error("Failed to place bid: No response from the server. Please check your network.");
      } else {
        console.error('Error placing bid:', {
          message: error.message,
        });
        toast.error("Failed to place bid. Please try again.");
      }
    }finally{
      setLoading(false);
    }
  };
  

  return (
    <div>      
      {/* <Typography variant='h3' className='mb-3 text-black'>Listed Property</Typography> */}
      {properties.length ===0 &&(
              <div className='flex items-center p-6 justify-center'>
              <Typography variant='h4' className='text-center text-gray-500'>No properties found</Typography>
              </div>
      )}
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {properties.length > 0 && (
      properties.map((property) => (
        <Card key={property._id} className="transition-shadow shadow-black duration-300 shadow-lg rounded-lg"
>
          <CardHeader floated={false}>
            <img
              src={property.imageUrl || 'default-image.jpg'} // Use a default image if imageUrl is missing
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
          </CardHeader>
           <CardBody className="px-4 py-3">
           <div className='flex items-center justify-center'>
            <Typography variant='small' color="gray" >
            {new Date(property.dateListed).toLocaleDateString()}
            </Typography>
            </div>
            <div className="pt-0 flex flex-col"> {/* Use flex column */}
  <div className="flex justify-between items-start"> {/* Title and Price row */}
    <div> {/* Title container */}
      <Typography variant="h5" className="font-bold text-gray-800">
        {property.title}
      </Typography>
    </div>
    <div className="flex items-end"> {/* Price container */}
      <Typography className="font-semibold text-blue-600">
        {property.price} PKR
      </Typography>
    </div>
  </div>
  <Typography color="blue-gray" className="text-sm"> {/* Location full width */}
    Location: {property.location}
  </Typography>
  <Typography color="gray" className="text-sm my-2"> {/* Description full width */}
    {property.description}
  </Typography>
</div>
                 </CardBody>
          <CardFooter className="pt-0 flex justify-between">
            <Button size="sm" color="blue" className="text-white shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md" onClick={() => handleOpenDialog(property)}>
              Read More
            </Button>
            {(token && property.owner._id !== userId && !property.bids.some(bid => bid.buyer._id === userId)) && (
            <Button size="sm" className="bg-black text-white shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md" onClick={()=> handleOpenBidDialog(property)}>
             Place Bid
            </Button>
            )}
          </CardFooter>
        </Card>
      ))
      )}

      {/* Dialog for property details */}
      {selectedProperty && (
        <Dialog open={open} handler={handleCloseDialog} className="max-w-lg">
          <DialogHeader className="relative">
            <Typography variant='h4' className='text-center w-full'>{selectedProperty.title}</Typography>
            <div className='absolute top-4 right-4'>
              <FaTimes
                size={20}
                color="red"
                className="cursor-pointer"
                onClick={handleCloseDialog}
              />
            </div>
          </DialogHeader>
          <DialogBody divider className="overflow-y-auto max-h-96 dashboard-1-scrollbar">
            <img
              src={selectedProperty.imageUrl || 'default-image.jpg'}
              alt={selectedProperty.title}
              className="w-full h-48 object-cover mb-4"
            />
            <Typography variant="small" color="blue-gray" className="font-medium">
              Price: {selectedProperty.price} PKR
            </Typography>
            <Typography color="gray" className="mt-2">
              Owner: {selectedProperty.owner.name} ({selectedProperty.owner.email})
            </Typography>
            <Typography color="gray" className="mt-2">
              Location: {selectedProperty.location}
            </Typography>
            <Typography color="gray" className="mt-2">
              Bedrooms: {selectedProperty.bedrooms}
            </Typography>
            <Typography color="gray" className="mt-2">
              Bathrooms: {selectedProperty.bathrooms}
            </Typography>
            <Typography color="gray" className="mt-2">
              Parking Spaces: {selectedProperty.parkingSpaces}
            </Typography>
            <Typography color="gray" className="mt-2">
              Area: {selectedProperty.area}
            </Typography>
            <Typography color="gray" className="mt-2">
              Furnished: {selectedProperty.furnished}
            </Typography>
            <Typography color="gray" className="mt-2">
              Condition: {selectedProperty.condition}
            </Typography>
            <Typography color="gray" className="mt-2">
              Gas Available: {selectedProperty.gasAvailable}
            </Typography>
            <Typography color="gray" className="mt-2">
              Additional Details: {selectedProperty.additionalDetails || 'N/A'}
            </Typography>
            <Typography color="gray" className="mt-2">
              Date Listed: {new Date(selectedProperty.dateListed).toLocaleDateString()}
            </Typography>
          </DialogBody>
        </Dialog>
      )}

      {/* Dialog for placing a bid */}
      <Dialog open={openBidDialog} handler={handleCloseBidDialog} className="max-w-md">
        <DialogHeader className="relative">
          <Typography variant='h4' className='text-center'>Place Your Bid</Typography>
          <div className='absolute top-4 right-4'>
            <FaTimes
              size={20}
              color="red"
              className="cursor-pointer"
              onClick={handleCloseBidDialog}
            />
          </div>
        </DialogHeader>
        <DialogBody divider>
          <Input
            label="Offer Price"
            type="number"
            value={offerPrice}
            // onChange={(e) => setOfferPrice(e.target.value)}
            onChange={handleChange}
            className="w-full focus:ring-0"
          />
        </DialogBody>
        <DialogFooter className='flex justify-between'>
          <Button size="sm" color="red" onClick={handleCloseBidDialog}>
            Cancel
          </Button>
          <Button size="sm" className='bg-black shadow-none hover:shadow-black'  disabled={loading} onClick={handleBidSubmit}>
            {loading ? "Submitting Bid..." : "Submit Bid"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
    </div>
  );
};

export default BookingCard;
