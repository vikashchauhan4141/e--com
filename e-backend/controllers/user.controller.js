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

module.exports = {
  getProfile,
  updateProfile,
};
