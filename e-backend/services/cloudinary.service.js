const cloudinary = require('cloudinary').v2;
const env = require('../config/env');

// Cloudinary automatically picks up process.env.CLOUDINARY_URL, 
// but we will explicitly bind it to ensure robust configuration behavior.
if (env.cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: env.cloudinaryUrl
  });
}

/**
 * Pipes an in-memory file buffer directly to Cloudinary via upload streams.
 * Avoids touching the local disk, optimizing performance and security.
 * 
 * @param {Buffer} fileBuffer - Raw buffer of the uploaded file
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<object>} Resolves with Cloudinary API upload metadata
 */
const uploadStreamToCloudinary = (fileBuffer, folder = 'stylee_atelier') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    
    // Pipe the buffer into the writeable stream
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadStreamToCloudinary
};
