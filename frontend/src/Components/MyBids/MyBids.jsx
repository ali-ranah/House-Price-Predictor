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
  Spinner,
} from "@material-tailwind/react";
import { FaTimes } from 'react-icons/fa';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import chatIcon from "../../assets/chat.png";
import socket from '../Socket/Socket';
import { selectEmail } from '../State/Reducers/emailSlice';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';


const MyBids = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // New state for login dialog
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const token = useSelector(selectToken) || localStorage.getItem('token');
  const userEmail = useSelector(selectEmail) || localStorage.getItem("email");
  const [unseenMessages, setUnseenMessages] = useState({});
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [existingReview, setExistingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem('userId');
const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoginDialogOpen(true); // Open login dialog if token is missing
      return;
    }
  },[token])

  const fetchUserReviews = async () => {
    try {
        const response = await AxiosRequest.get('/api/review/property/own_reviews', {
            headers: { Authorization: `Bearer ${token}` 
          },
        });
        setReviews(response.data);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        // toast.error(error.response?.data?.message || 'Failed to fetch reviews');
    }
};

  useEffect(() => {
    if (token) {
        fetchUserReviews();
    }
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
        // toast.error(error.response.data.message);
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

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false);
    setSelectedProperty(null);
    setRating(0);
    setComment("");
  };

  const handleOpenRatingDialog = (property) => {
    setSelectedProperty(property);
    const existingReview = reviews.find(review => review.propertyId._id === property._id);
    setExistingReview(existingReview ? true : false);
  
    if (existingReview) {
      // If a review exists, set the rating and comment, and disable editing
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      // If no review exists, allow editing
      setRating(0);
      setComment("");
    }
    setRatingDialogOpen(true);
  };
  
  const handleSubmitRating = async () => {
    if (!rating || !comment) {
      handleCloseRatingDialog();
      toast.error("Please provide a rating and comment.");
      return;
    }
  
    // Check if a review already exists before submitting
    const existingReview = reviews.find(review => review.propertyId._id === selectedProperty._id);
    if (existingReview) {
      handleCloseRatingDialog();
      toast.error("You have already submitted a review for this property.");
      return; // Do not submit if review already exists
    }
  
    try {
      const response = await AxiosRequest.post(
        `/api/review/property/${selectedProperty._id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success(response.data.message || "Review added successfully");
      fetchUserReviews();
      handleCloseRatingDialog();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Error adding review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // Make the API call to delete the review
      const response = await AxiosRequest.delete(`/api/review/review/${reviewId}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        // Remove the deleted review from the local state
        setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
        handleCloseDialog();
        toast.success('Review deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting review", error);
      handleCloseDialog();
      toast.error('There was an error deleting the review');
    }
  };
  
  

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Typography variant="h3" className="text-center py-4 text-gray-800 font-semibold">
        My Bids
        </Typography>

      {/* Show loading spinner or message */}
     {loading ? (
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
                     {property.buyer === userId &&(
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
{property.buyer === userId && (
  <StarIcon
    className="h-6 w-6 text-gray-500 hover:text-blue-500 cursor-pointer transition-transform duration-300 hover:scale-110"
    onClick={() => handleOpenRatingDialog(property)}
  />
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
             You haven't placed any bids yet. Start by submitting your offer now.
           </Typography>
         )}
           <Dialog open={ratingDialogOpen} handler={handleCloseRatingDialog}>
        <DialogHeader className='relative'>
        <div className="flex items-center justify-center w-full">
        <Typography variant="h5" className="font-bold text-center">
        Rate {selectedProperty?.title}
        </Typography>
          </div>
          <FaTimes
                 size={20}
                 color="red"
                 className="cursor-pointer absolute top-4 right-4"
                 onClick={handleCloseRatingDialog}
               />
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col space-y-4">
              <div className="flex justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={star <= rating ? "gold" : "gray"}
          className={`h-8 w-8 cursor-pointer transition-transform duration-200 hover:scale-110 ${existingReview ? 'pointer-events-none' : ''}`}
          onClick={() => existingReview ? null : setRating(star)} // Prevent clicks if review exists
        >
          <path d="M12 .587l3.668 7.572 8.332 1.151-6.064 5.737 1.568 8.319L12 18.897 4.496 23.366l1.568-8.319L0 9.31l8.332-1.151z" />
        </svg>
      ))}
    </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment"
              className="border border-gray-300 rounded p-2 resize-none"
              rows="4"
              readOnly={existingReview}
              disabled={existingReview}
            ></textarea>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between items-center">
  <Button color="red" onClick={handleCloseRatingDialog}>
    Cancel
  </Button>
  <Button color="green" onClick={handleSubmitRating}>
    Submit
  </Button>
</DialogFooter>

      </Dialog>
   
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
              {/* Reviews Section */}
              {reviews && reviews.length > 0 && (
                  <div className="mt-4 flex flex-col">
            {reviews
              .filter((review) => review.propertyId._id === selectedProperty._id)
              .map((review) => (
                <div key={review._id} className="p-2 bg-gray-100 flex justify-between rounded-lg my-2">
                                <div>
                  <Typography className="font-bold text-gray-600">My Review:</Typography>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        style={{ color: index < review.rating ? "gold" : "gray" }}
                        fontSize="small"
                      />
                    ))}
                  </div>
                  <Typography color="gray" className="text-sm">
                    {review.comment}
                  </Typography>
                </div>
                <DeleteIcon
                onClick={() => handleDeleteReview(review._id)}
                className="cursor-pointer text-red-500 hover:text-red-700"
                fontSize="small"
              />
            </div>
              ))}
          </div>
        )}
               </div>
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
