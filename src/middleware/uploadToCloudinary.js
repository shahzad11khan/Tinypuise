// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadToCloudinary = (stream, filename) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload(
//       { resource_type: 'auto', public_id: filename },
//       (error, result) => {
//         if (error) {
//           return reject(error);
//         }
//         resolve(result);
//       }
//     );
//     stream.pipe(uploadStream);  // Pipe the file stream to Cloudinary
//   });
// };


// module.exports = { uploadToCloudinary };

const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject('Cloudinary upload failed');
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer); // Send the file buffer to Cloudinary
  });
};


module.exports = { uploadToCloudinary };
