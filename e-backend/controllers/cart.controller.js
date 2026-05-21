const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {
  getOrCreateCart,
  serializeCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Cart fetched successfully'));
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await addItemToCart(req.user._id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Item added to cart successfully'));
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItemQuantity(req.user._id, req.params.itemId, req.body.quantity);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Cart item updated successfully'));
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user._id, req.params.itemId);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Cart item removed successfully'));
});

const clear = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Cart cleared successfully'));
});

const applyPromoCode = asyncHandler(async (req, res) => {
  const cart = await applyCoupon(req.user._id, req.body.code);

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Promo code applied successfully'));
});

const removePromoCode = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.couponCode = '';
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, { cart: serializeCart(cart) }, 'Promo code removed successfully'));
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
  applyPromoCode,
  removePromoCode,
};
