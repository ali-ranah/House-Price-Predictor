import AxiosRequest from "../AxiosRequest/AxiosRequest";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // Replace with your upload preset
  formData.append("cloud_name", "di3ysmabw");

  try {
    const response = await AxiosRequest.post(
      `https://api.cloudinary.com/v1_1/di3ysmabw/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    throw error;
  }
};

export { uploadImageToCloudinary };
