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
} from "@material-tailwind/react";
import { FaTimes } from 'react-icons/fa';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import toast from 'react-hot-toast';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const token = useSelector(selectToken) || localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await AxiosRequest.get('/api/bns/user/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
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

  const handleAcceptBid = async (propertyId, bidId) => {
    try {
        const response = await AxiosRequest.patch(`/api/bns/property/${propertyId}/bid/accept`, { bidId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success(response.data.message);
        // Optionally refresh the properties list or update the UI state
    } catch (error) {
        console.error('Error accepting bid:', error);
        toast.error(error.response.data.message);
    }
};

const handleRejectBid = async (propertyId, bidId) => {
    try {
        const response = await AxiosRequest.patch(`/api/bns/property/${propertyId}/bid/reject`, { bidId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success(response.data.message);
        // Optionally refresh the properties list or update the UI state
    } catch (error) {
        console.error('Error rejecting bid:', error);
        toast.error(error.response.data.message);
    }
};

  return (
    <div>
      <Typography variant='h3' className='mb-3 mt-3 text-center'>My Properties</Typography>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property._id} className="w-full max-w-[26rem] shadow-lg">
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
              <Typography color="gray">Bedrooms: {property.bedrooms}</Typography>
              <Typography color="gray">Bathrooms: {property.bathrooms}</Typography>
              <Typography color="gray">Parking: {property.parkingSpaces}</Typography>
              <Typography color="gray">Area: {property.area}</Typography>
              <Typography color="gray">Condition: {property.condition}</Typography>
              <Typography color="gray">Gas Available: {property.gasAvailable}</Typography>
            </CardBody>
            <CardFooter className="pt-0 flex justify-center">
              <Button size="sm" color="blue" onClick={() => handleOpenDialog(property)}>
                View Bids
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" color="green" onClick={() => handleAcceptBid(selectedProperty._id, bid._id)}>
                      Accept
                    </Button>
                    <Button size="sm" color="red" onClick={() => handleRejectBid(selectedProperty._id, bid._id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Typography color="gray" className="mt-2">No bids placed yet.</Typography>
            )}
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
};

export default MyProperties;
