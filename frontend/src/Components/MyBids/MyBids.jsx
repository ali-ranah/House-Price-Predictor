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
  Spinner,
} from "@material-tailwind/react";
import { FaTimes } from 'react-icons/fa';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyBids = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // New state for login dialog
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const token = useSelector(selectToken) || localStorage.getItem('token');
const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoginDialogOpen(true); // Open login dialog if token is missing
      return;
    }
  },[token])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await AxiosRequest.get('/api/bns/user/bids', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchProperties();
  }, [token]);

  const handleOpenDialog = (property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/home');
  };

  return (
    <div className='flex flex-col min-h-screen bg-[#FEF9F2]'>      
      <Typography variant='h3' className='mb-3 mt-3 text-center'>My Bids</Typography>

      {/* Show loading spinner or message */}
      {loading ? (
              <div className="flex items-center justify-center min-h-screen bg-[#FEF9F2] font-poppins">
              <Spinner color='white' className="h-12 w-12 text-black" />
            </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property._id} className="w-full max-w-[26rem] shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
              <CardHeader floated={false}>
                <img
                  src={property.imageUrl || 'default-image.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
              </CardHeader>
              <CardBody>
                <div className="mb-3 flex items-center justify-between">
                  <Typography variant="h5" color="blue-gray" className="font-medium">
                    {property.title}
                  </Typography>
                  <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal">
                    {property.price} PKR
                  </Typography>
                </div>
                <Typography color="gray">{property.description}</Typography>
                <Typography color="gray" className="mt-2">Location: {property.location}</Typography>
              </CardBody>
              <CardFooter className="pt-0 flex justify-center">
                <Button size="sm" color="blue" onClick={() => handleOpenDialog(property)}>
                  View Bids
                </Button>
                   {property.bids.some(bid => bid.status === 'accepted') && (
                                  <Button
                                    size="sm"
                                    color="green"
                                    onClick={() =>
                                      navigate('/chat', {
                                        state: {
                                          buyer: property.bids.find(bid => bid.status === 'accepted').buyer,
                                          seller: property.owner,
                                          propertyId: property._id,
                                        },
                                      })
                                    }
                                  >
                                    Chat
                                  </Button>
                                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Typography variant="h6" color="gray" className="text-center mt-10">
          No bids found.
        </Typography>
      )}

      {/* Dialog for viewing bids */}
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
              Bids:
            </Typography>
            {selectedProperty.bids.length > 0 ? (
              selectedProperty.bids.map(bid => (
                <div key={bid._id} className="mt-2">
                  <Typography color="gray">Bidder: {bid.buyer.name} ({bid.buyer.email})</Typography>
                  <Typography color="gray">Offer Price: {bid.offerPrice} PKR</Typography>
                  <Typography color="gray">Status: {bid.status}</Typography>
                  <Typography color="gray">Placed At: {new Date(bid.placedAt).toLocaleString()}</Typography>
                </div>
              ))
            ) : (
              <Typography color="gray" className="mt-2">No bids placed yet.</Typography>
            )}
          </DialogBody>
        </Dialog>
      )}
       {/* Login required dialog */}
       <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} className="max-w-sm">
          <div className='flex items-center justify-center text-center mt-4 mb-4'>
          <Typography variant="h5" className='text-black'>Login Required</Typography>
          </div>
        <DialogBody divider>
          <Typography color="gray" className="text-center">
            You need to log in to view your bids.
          </Typography>
          <div className="flex justify-around mt-4">
            <Button className='bg-black !shadow-none' onClick={handleNavigateLogin}>
              Go to Login
            </Button>
            <Button className='bg-black !shadow-none' onClick={handleNavigateHome}>
              Go to Home
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default MyBids;
