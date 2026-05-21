const mongoose = require('mongoose');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const findProductByAnyId = async (value) => {
  const query = [];

  if (mongoose.Types.ObjectId.isValid(value)) {
    query.push({ _id: value });
  }

  if (!Number.isNaN(Number(value))) {
    query.push({ legacyId: Number(value) });
  }

  query.push({ slug: value });

  const product = await Product.findOne({
    isActive: true,
    $or: query,
  }).populate('category', 'name slug image description');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
};

module.exports = {
  findProductByAnyId,
};
