const express = require('express');
const multer = require('multer');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { uploadStreamToCloudinary } = require('../services/cloudinary.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Configure Multer storage to keep uploaded files in RAM memory as Buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file capacity
  fileFilter: (req, file, cb) => {
    // Restrict uploads strictly to valid image mime types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are permitted'), false);
    }
  }
});

// @desc    Secure administrative image upload endpoint
// @route   POST /api/admin/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  isAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'No file found. Please upload a valid image file under the "image" field.');
    }

    try {
      // Pipe file buffer directly to Cloudinary
      const result = await uploadStreamToCloudinary(req.file.buffer, 'stylee_atelier');
      
      res.status(200).json(
        new ApiResponse(
          200,
          {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes
          },
          'Image uploaded to Cloudinary successfully'
        )
      );
    } catch (err) {
      console.error('Cloudinary stream pipe failure:', err);
      throw new ApiError(500, `Cloudinary upload process failed: ${err.message}`);
    }
  })
);

module.exports = router;
