const Address = require('../models/address.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, { addresses }, 'Addresses fetched successfully'));
});

const addAddress = asyncHandler(async (req, res) => {
  const { type, fullName, street, city, state, zipCode, country, phone, isDefault } = req.body;

  if (!fullName || !street || !city || !state || !zipCode || !phone) {
    throw new ApiError(400, 'Full name, street, city, state, zip code, and phone are required');
  }

  const existingCount = await Address.countDocuments({ user: req.user._id });
  const shouldBeDefault = Boolean(isDefault) || existingCount === 0;

  if (shouldBeDefault) {
    await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
  }

  const address = await Address.create({
    user: req.user._id,
    type,
    fullName,
    street,
    city,
    state,
    zipCode,
    country,
    phone,
    isDefault: shouldBeDefault,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { address }, 'Address added successfully'));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  if (address.isDefault) {
    const nextAddress = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Address deleted successfully'));
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
  address.isDefault = true;
  await address.save();

  res
    .status(200)
    .json(new ApiResponse(200, { address }, 'Default address updated successfully'));
});

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
};
