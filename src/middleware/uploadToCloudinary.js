const cloudinary = require('cloudinary').v2;
// const {v4 : uuidv4} = require('uuid');

// const uploadToCloudinary = async (fileBuffer) => {
//   // const uniqueId = `${uuidv4()}${fileName}`;
//   return new Promise((resolve, reject) => {
//     const base64String = fileBuffer;
//     cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'auto',
//         // public_id: uniqueId,
//       },
//       (error, result) => {
//         if (error) {
//           reject('Cloudinary upload failed');
//         } else {
//           resolve(result);
//         }
//       }
//     ).end(Buffer.from(base64String, 'base64')); // Send the file buffer to Cloudinary
//   });
// };

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



module.exports = { uploadToCloudinary };
