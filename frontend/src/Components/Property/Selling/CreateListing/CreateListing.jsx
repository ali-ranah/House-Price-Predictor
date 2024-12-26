import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, Select, Option, Dialog, Typography, DialogBody } from "@material-tailwind/react";
import { motion } from "framer-motion";
import AxiosRequest from '../../../AxiosRequest/AxiosRequest';
import { useSelector } from "react-redux";
import { selectToken } from "../../../State/Reducers/tokenSlice";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "", 
    area: "",
    furnished: "",
    condition: "",
    gasAvailable: "",
    additionalDetails: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const [loginDialogOpen, setLoginDialogOpen] = useState(false); // New state for login dialog
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      setLoginDialogOpen(true); // Open login dialog if token is missing
      return;
    }
  },[token])

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validate numeric fields to not allow values less than 1
    if (['price', 'bedrooms', 'bathrooms'].includes(name)) {
      // Check if the input value is empty or a valid number greater than 1
      if (value === '' || (Number(value) > 0 && /^\d+(\.\d+)?$/.test(value))) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImageFile(file);
      }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Append image file if it exists
    if (imageFile) {
        data.append("image", imageFile);
    } else {
        console.log('No image file selected.');
    }

    try {
        const response = await AxiosRequest.post("/api/bns/property", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        toast.success(response.data.message);

        // Reset form data
        setFormData({
            title: "",
            description: "",
            price: "",
            location: "",
            bedrooms: "",
            bathrooms: "",
            parkingSpaces: "",
            area: "",
            furnished: "",
            condition: "",
            gasAvailable: "",
            additionalDetails: ""
        });
        setImageFile(null);
    } catch (error) {
        console.error('Error response:', error.response ? error.response.data : error.message);
        toast.error("Failed to list property");
    } finally {
        setLoading(false); // Ensure loading is set to false in any case
    }
};
  

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full p-6"
      >
       <Card className="p-8 min-w-screen shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
      <Typography variant="h4" className="text-center py-4 text-gray-800 font-semibold">
            List Property for Sale
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                variant="outlined"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Textarea
                variant="outlined"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                resize={true}
                className="w-full focus:!ring-0"
              />
            </div>

            <div className="mb-4">
              <Input
                variant="outlined"
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Input
                variant="outlined"
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Input
                variant="outlined"
                label="Upload Image of the Property"
                type="file"
                name="image"
                onChange={handleFileChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Input
                variant="outlined"
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Input
                variant="outlined"
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                className="focus:ring-0"
                required
              />
            </div>

            <div className="mb-4">
              <Select
                label="Parking Spaces Available"
                value={formData.parkingSpaces}
                onChange={(value) => handleSelectChange("parkingSpaces", value)}
                className="focus:ring-0"
                required
              >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </div>

            <div className="mb-4">
              <Select
                label="Area (in Marla/Kanal)"
                value={formData.area}
                onChange={(value) => handleSelectChange("area", value)}
                className="focus:ring-0"
                required
              >
                <Option value="1 Marla">1 Marla</Option>
                <Option value="2 Marla">2 Marla</Option>
                <Option value="3 Marla">3 Marla</Option>
                <Option value="4 Marla">4 Marla</Option>
                <Option value="5 Marla">5 Marla</Option>
                <Option value="1 Kanal">1 Kanal</Option>
                <Option value="2 Kanal">2 Kanal</Option>
                <Option value="3 Kanal">3 Kanal</Option>
                <Option value="4 Kanal">4 Kanal</Option>
              </Select>
            </div>

            <div className="mb-4">
              <Select
                label="Furnished"
                value={formData.furnished}
                onChange={(value) => handleSelectChange("furnished", value)}
                className="focus:ring-0"
                required
              >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </div>

            <div className="mb-4">
              <Select
                label="Condition"
                value={formData.condition}
                onChange={(value) => handleSelectChange("condition", value)}
                className="focus:ring-0"
                required
              >
                <Option value="New">New</Option>
                <Option value="Renovated">Renovated</Option>
                <Option value="Needs Work">Needs Work</Option>
              </Select>
            </div>

            <div className="mb-4">
              <Select
                label="Gas Available"
                value={formData.gasAvailable}
                onChange={(value) => handleSelectChange("gasAvailable", value)}
                className="focus:ring-0"
                required
              >
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </div>

            <div className="mb-4">
              <Textarea
                variant="outlined"
                label="Additional Details"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                rows={4}
                resize={true}
                className="w-full focus:ring-0"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md"
                disabled={loading}
              >
                {loading ? "Listing..." : "List Property"}
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
      {/* Login required dialog */}
      <Dialog open={loginDialogOpen} handler={() => setLoginDialogOpen(false)} className="max-w-sm">
          <div className='flex items-center justify-center text-center mt-4 mb-4'>
          <Typography variant="h5" className='text-black'>Login Required</Typography>
          </div>
        <DialogBody divider>
          <Typography color="gray" className="text-center">
            You need to log in to sell your property.
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
    </div>
  );
};

export default CreateListing;
