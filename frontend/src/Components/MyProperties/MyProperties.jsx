import React, { useEffect, useState } from "react";
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
import { FaTimes } from "react-icons/fa";
import AxiosRequest from "../AxiosRequest/AxiosRequest";
import { useSelector } from "react-redux";
import { selectToken } from "../State/Reducers/tokenSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import chatIcon from "../../assets/chat.png";
import socket from '../Socket/Socket'; // Import socket logic
import { selectEmail } from "../State/Reducers/emailSlice";
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'; 


const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const[acceptBid,setAcceptBid]=useState(false);
  const[rejectBid,setRejectBid]=useState(false);
  const [unseenMessages, setUnseenMessages] = useState({});
  const token = useSelector(selectToken) || localStorage.getItem("token");
  const userEmail = useSelector(selectEmail) || localStorage.getItem("email");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoginDialogOpen(true);
      return;
    }
  }, [token]);

  // Fetch properties
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosRequest.get("/api/bns/user/properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      // toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    // Show SweetAlert confirmation dialog
    const { value: confirmDelete } = await Swal.fire({
      title: 'Are you sure you want to delete this property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
  
    if (confirmDelete) {
      try {
        const response = await AxiosRequest.delete(`/api/property/property/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire('Deleted!', response.data.message, 'success'); // Show success alert
        fetchProperties(); // Refresh the property list after deletion
      } catch (error) {
        console.error("Error deleting property:", error);
        Swal.fire('Error!', 'Failed to delete property', 'error'); // Show error alert
      }
    }
  };

  const fetchReviews = async (propertyId) => {
    try {
      const response = await AxiosRequest.get(`/api/review/property/${propertyId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [token]);

  // WebSocket Setup
  useEffect(() => {
    if (token && userEmail) {
      socket.emit("USER_CONNECTED", { userEmail });

      // Listen for unseen message counts grouped by propertyId
      socket.on("UNSEEN_MESSAGE_COUNT", ({ unseenMessage }) => {
        console.log("Unseen message count", unseenMessage);
        setUnseenMessages(unseenMessage);
      });

      // Handle errors related to unseen counts
      socket.on("UNSEEN_COUNT_ERROR", ({ error }) => {
        console.error("Socket Error:", error);
        toast.error(error || "Failed to fetch unseen message counts");
      });

      // Cleanup socket listeners
      return () => {
        socket.off("UNSEEN_MESSAGE_COUNT");
        socket.off("UNSEEN_COUNT_ERROR");
      };
    }
  }, [token, userEmail]);

  const handleOpenDialog = (property) => {
    setSelectedProperty(property);
    fetchReviews(property._id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleNavigateLogin = () => navigate("/login");
  const handleNavigateHome = () => navigate("/home");

  const handleAcceptBid = async (propertyId, bidId) => {
    try {
      setAcceptBid(true);
      const response = await AxiosRequest.patch(
        `/api/bns/property/${propertyId}/bid/accept`,
        { bidId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleCloseDialog();
      toast.success(response.data.message);
      fetchProperties();
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast.error(error.response.data.message);
    }finally {
      setAcceptBid(false);
    }
  };

  const handleRejectBid = async (propertyId, bidId) => {
    try {
      setRejectBid(true);
      const response = await AxiosRequest.patch(
        `/api/bns/property/${propertyId}/bid/reject`,
        { bidId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleCloseDialog();
      toast.success(response.data.message);
      fetchProperties();
    } catch (error) {
      console.error("Error rejecting bid:", error);
      toast.error(error.response.data.message);
    }finally{
      setRejectBid(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Typography variant="h3" className="text-center py-4 text-gray-800 font-semibold">
        My Properties
      </Typography>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <Spinner className="h-16 w-16 text-blue-600" />
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 px-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card
              key={property._id}
              className="transition-shadow duration-300 hover:shadow-lg shadow-md rounded-lg"
            >
              <CardHeader floated={false} className="relative">
  <img
    src={property.imageUrl || "/default-image.jpg"}
    alt={property.title}
    className="w-full h-48 object-cover rounded-t-lg"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
  
  <DeleteIcon
    className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700"
    fontSize="small"
    onClick={() => handleDeleteProperty(property._id)} // Trigger delete function
  />
</CardHeader>

              <CardBody className="px-4 py-3">
                <Typography variant="h5" className="font-bold text-gray-800">
                  {property.title}
                </Typography>
                <Typography color="gray" className="text-sm my-2">
                  {property.description}
                </Typography>
                <Typography color="blue-gray" className="text-sm">
                  Location: {property.location}
                </Typography>
              </CardBody>
              <CardFooter className="flex justify-between items-center px-4 py-3">
                <Typography className="font-semibold text-blue-600">
                  {property.price} PKR
                </Typography>
                <div className="flex items-center space-x-2">
                  {property.bids.find(bid => bid.status === 'accepted')&&(
                  <div className="relative">
                    <img
                      src={chatIcon}
                      alt="Chat"
                      className="w-8 h-8 cursor-pointer hover:opacity-80"
                      onClick={() =>
                        navigate('/chat', {
                          state: {
                            buyer: property.bids.find(bid => bid.status === 'accepted').buyer,
                            seller: property.owner,
                            propertyId: property._id,
                          },
                        })
                      }
                    />
          {unseenMessages[property._id] > 0 && (
                           <div className="absolute bottom-5 left-5 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unseenMessages[property._id]}
                        </div>
                      )}
                  </div>
                  )}
                  <Button 
                  size="sm"
                  className="bg-black text-white shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md" 
                  onClick={() => handleOpenDialog(property)}>
                    View Bids
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Typography variant="h6" className="text-center text-gray-600 mt-10">
        You haven't listed any properties for sale yet. Start by adding your property now.
      </Typography>
      )}

      {selectedProperty && (
        <Dialog open={open} handler={handleCloseDialog} className="max-w-lg">
          <DialogHeader className="relative">
            <div className="flex items-center justify-center w-full">
              <Typography variant="h5" className="font-bold text-center">
                {selectedProperty.title}
              </Typography>
            </div>

            <FaTimes
              size={20}
              color="red"
              className="cursor-pointer absolute top-4 right-4"
              onClick={handleCloseDialog}
            />
          </DialogHeader>

          <DialogBody divider className="overflow-y-auto max-h-96 dashboard-1-scrollbar">
            <img
              src={selectedProperty.imageUrl || "/default-image.jpg"}
              alt={selectedProperty.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div key={selectedProperty._id} className="p-2 mt-2 bg-gray-100 rounded-lg">
              <Typography variant="small" className="text-gray-800">
                Price: {selectedProperty.price} PKR
              </Typography>
              <Typography variant="small" className="text-gray-800">Location: {selectedProperty.location}</Typography>
              <Typography variant="small" className="text-gray-800">Bedrooms: {selectedProperty.bedrooms}</Typography>
              <Typography variant="small" className="text-gray-800">Bathrooms: {selectedProperty.bathrooms}</Typography>
              <Typography variant="small" className="text-gray-800">Parking: {selectedProperty.parkingSpaces}</Typography>
              <Typography variant="small" className="text-gray-800">Area: {selectedProperty.area}</Typography>
              <Typography variant="small" className="text-gray-800">Condition: {selectedProperty.condition}</Typography>
              <Typography variant="small" className="text-gray-800">Gas Available: {selectedProperty.gasAvailable}</Typography>
              <Typography variant="body2" className="text-gray-800">
                {selectedProperty.description}
              </Typography>
            </div>
            <Typography variant="lead" className="text-gray-800 font-bold text-center mt-4">
              Review:
            </Typography>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="p-2 bg-gray-100 rounded-lg my-2">
                  <Typography variant="small" className="text-gray-800">
                    Reviewer: {review.userId.name} ({review.userId.email})
                  </Typography>
                  {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        style={{ color: index < review.rating ? "gold" : "gray" }}
                        fontSize="small"
                      />
                    ))}
                  <Typography variant="small" className="text-gray-800">
                    {review.comment}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="small" className="text-gray-600">
                No reviews yet.
              </Typography>
            )}
            <Typography variant="lead" className="text-gray-800 font-bold text-center">
              Bids:
            </Typography>
            {selectedProperty.bids.length > 0 ? (
              selectedProperty.bids.map((bid) => (
                <div key={bid._id} className="p-2 bg-gray-100 rounded-lg">
                  <Typography variant="small" className="text-gray-800">
                    Bidder: {bid.buyer.name} ({bid.buyer.email})
                  </Typography>
                  <Typography variant="small" className="text-gray-800">Amount: {bid.offerPrice} PKR</Typography>
                  <Typography variant="small" className="text-gray-800">Status: {bid.status}</Typography>
                  <Typography variant="small" className="text-gray-800">Date: {new Date(bid.placedAt).toLocaleDateString()}</Typography>
                  {bid.status === "pending" && (
                  <div className="mt-2 flex justify-around">
                    <Button
                      size="sm"
                      color="green"
                      disabled={acceptBid || rejectBid}
                      onClick={() => handleAcceptBid(selectedProperty._id, bid._id)}
                    >
                    Accept
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      disabled={rejectBid || acceptBid}
                      onClick={() => handleRejectBid(selectedProperty._id, bid._id)}
                    >
                    Reject                                
                    </Button>
                  </div>
                  )}
                </div>
              ))
            ) : (
              <Typography variant="small" className="text-gray-600">
                No bids yet.
              </Typography>
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
            You need to log in to view your properties.
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

export default MyProperties;
