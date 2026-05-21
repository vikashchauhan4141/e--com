const Wishlist = require('../models/wishlist.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { findProductByAnyId } = require('../services/product.service');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await wishlist.populate('products');
  }

  return wishlist;
};

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, { wishlist }, 'Wishlist fetched successfully'));
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await findProductByAnyId(req.params.productId);
  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((item) => item._id.equals(product._id));

  if (exists) {
    wishlist.products = wishlist.products.filter((item) => !item._id.equals(product._id));
  } else {
    wishlist.products.push(product._id);
  }

  await wishlist.save();
  await wishlist.populate('products');

  res.status(200).json(
    new ApiResponse(
      200,
      { wishlist, inWishlist: !exists },
      exists ? 'Product removed from wishlist' : 'Product added to wishlist'
    )
  );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const product = await findProductByAnyId(req.params.productId);
  const wishlist = await getOrCreateWishlist(req.user._id);

  wishlist.products = wishlist.products.filter((item) => !item._id.equals(product._id));
  await wishlist.save();
  await wishlist.populate('products');

  res
    .status(200)
    .json(new ApiResponse(200, { wishlist }, 'Product removed from wishlist'));
});

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
};
