const cloudinary = require('./cloudinaryConfig');

const addImage = async (fileBuffer) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            return reject(new Error(error.message));
          }
          resolve(result);
        }
      );

      // End the stream with the fileBuffer
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error in addImage:', error);
    throw new Error(error.message);
  }
};


const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateImage = async (public_id, fileBuffer) => {
  try {
    // First, delete the existing image
    await deleteImage(public_id);

    // Then, upload the new image
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            return reject(new Error(error.message));
          }
          resolve(result);
        }
      );

      // End the stream with the fileBuffer
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addImage,
  deleteImage,
  updateImage,
};
