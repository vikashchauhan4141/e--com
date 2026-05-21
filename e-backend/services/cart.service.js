const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const { calculatePricing, normalizeCoupon } = require('../utils/pricing');
const { findProductByAnyId } = require('./product.service');

const cartPopulate = {
  path: 'items.product',
  select: 'legacyId name slug image price discountPrice stock sizes colors',
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(cartPopulate);

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate(cartPopulate);
  }

  return cart;
};

const serializeCart = (cart) => {
  const items = cart.items.map((item) => ({
    _id: item._id,
    product: item.product,
    name: item.name,
    image: item.image,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    priceSnapshot: item.priceSnapshot,
    lineTotal: item.priceSnapshot * item.quantity,
  }));

  const pricing = calculatePricing(items, cart.couponCode);

  return {
    _id: cart._id,
    user: cart.user,
    items,
    ...pricing,
    totalItemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const addItemToCart = async (userId, payload) => {
  const { productId, quantity = 1, size, color } = payload;

  if (!productId || !size || !color) {
    throw new ApiError(400, 'Product, size, and color are required');
  }

  const product = await findProductByAnyId(productId);
  const requestedQty = Number(quantity);

  if (!Number.isInteger(requestedQty) || requestedQty < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  if (!product.sizes.includes(size)) {
    throw new ApiError(400, 'Selected size is not available for this product');
  }

  if (!product.colors.includes(color)) {
    throw new ApiError(400, 'Selected color is not available for this product');
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => {
    return item.product._id.equals(product._id) && item.size === size && item.color === color;
  });

  const finalQty = existingItem ? existingItem.quantity + requestedQty : requestedQty;

  if (finalQty > product.stock) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  if (existingItem) {
    existingItem.quantity = finalQty;
    existingItem.priceSnapshot = product.discountPrice || product.price;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      size,
      color,
      quantity: requestedQty,
      priceSnapshot: product.discountPrice || product.price,
    });
  }

  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const requestedQty = Number(quantity);

  if (!Number.isInteger(requestedQty) || requestedQty < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }

  const product = await Product.findById(item.product._id || item.product);

  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }

  if (requestedQty > product.stock) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  item.quantity = requestedQty;
  item.priceSnapshot = product.discountPrice || product.price;

  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const removeCartItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }

  item.deleteOne();
  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.couponCode = '';
  await cart.save();
  return cart;
};

const applyCoupon = async (userId, couponCode) => {
  const code = normalizeCoupon(couponCode);

  if (!['STYLEE10', 'LAVENDER10', 'AURA10', 'FREESHIP'].includes(code)) {
    throw new ApiError(400, 'Invalid promo code');
  }

  const cart = await getOrCreateCart(userId);

  if (cart.items.length === 0) {
    throw new ApiError(400, 'Cannot apply coupon to an empty cart');
  }

  cart.couponCode = code;
  await cart.save();
  await cart.populate(cartPopulate);
  return cart;
};

module.exports = {
  getOrCreateCart,
  serializeCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
};
