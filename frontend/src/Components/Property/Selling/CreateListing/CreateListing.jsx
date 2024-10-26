import React, { useState } from "react";
import { Button, Input, Textarea, Card, Select, Option } from "@material-tailwind/react";
import { motion } from "framer-motion";
import AxiosRequest from '../../../AxiosRequest/AxiosRequest';
import { useSelector } from "react-redux";
import { selectToken } from "../../../State/Reducers/tokenSlice";
import toast from 'react-hot-toast'

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full p-6 bg-white shadow-md rounded-lg"
      >
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            List Property for Sale
          </h2>

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
                className="w-full focus:ring-0"
                required
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
                color="blue"
                ripple="light"
                fullWidth
                disabled={loading}
              >
                {loading ? "Listing..." : "List Property"}
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateListing;