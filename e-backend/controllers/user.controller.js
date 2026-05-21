const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, 'Profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (avatar !== undefined) req.user.avatar = avatar;

  await req.user.save();

  res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, 'Profile updated successfully'));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Password updated successfully'));
});

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};
