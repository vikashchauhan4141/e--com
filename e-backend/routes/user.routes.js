const express = require('express');
const { getProfile, updateProfile, updatePassword } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);

module.exports = router;
