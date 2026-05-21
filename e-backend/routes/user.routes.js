const express = require('express');
const multer = require('multer');
const { getProfile, updateProfile, updatePassword, updateAvatar } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const ApiError = require('../utils/ApiError');

const router = express.Router();

// Configure Multer storage to keep uploaded files in RAM memory as Buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB file capacity for avatars
  fileFilter: (req, file, cb) => {
    // Restrict uploads strictly to valid image mime types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are permitted'), false);
    }
  }
});

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);
router.patch('/avatar', upload.single('avatar'), updateAvatar);

module.exports = router;
