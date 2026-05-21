const Category = require('../models/category.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, { categories }, 'Categories fetched successfully'));
});

module.exports = {
  getCategories,
};
