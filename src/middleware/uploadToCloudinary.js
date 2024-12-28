const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const base64String = fileBuffer; // Ensure fileBuffer is a base64-encoded string

    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
      },
      
      (error, result) => {
        if (error) {
          reject('Cloudinary upload failed: ' + error.message);
        } else {
          // Logging the result for debugging
          console.log(result); // Ensure this shows 'secure_url' and 'public_id'
          resolve(result); // Return the full result with secure_url and public_id
        }
      }
    ).end(Buffer.from(base64String, 'base64')); // Ensure base64 string is correctly handled
  });
};
const updateimage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {

   cloudinary.uploader.upload(fileBuffer, { resource_type: 'image' },(error, result) => {
      if (error) {
        reject('Cloudinary upload failed: ' + error.message);
      } else {
        console.log(result); // Ensure this shows 'secure_url' and 'public_id'
        resolve(result); // Return the full result with secure_url and public_id
      }
    });
  });
  };






module.exports = { uploadToCloudinary,updateimage };
