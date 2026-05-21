const Address = require('../models/address.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const { calculatePricing } = require('../utils/pricing');
const { getOrCreateCart, serializeCart } = require('./cart.service');

const makeOrderNumber = () => `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

const resolveShippingAddress = async (userId, payload) => {
  if (payload.shippingAddress) {
    return payload.shippingAddress;
  }

  if (payload.addressId) {
    const address = await Address.findOne({ _id: payload.addressId, user: userId });

    if (!address) {
      throw new ApiError(404, 'Shipping address not found');
    }

    return {
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
    };
  }

  const defaultAddress = await Address.findOne({ user: userId, isDefault: true });

  if (!defaultAddress) {
    throw new ApiError(400, 'Shipping address is required');
  }

  return {
    fullName: defaultAddress.fullName,
    street: defaultAddress.street,
    city: defaultAddress.city,
    state: defaultAddress.state,
    zipCode: defaultAddress.zipCode,
    country: defaultAddress.country,
    phone: defaultAddress.phone,
  };
};

const validateOrderStock = async (cart) => {
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id || item.product);

    if (!product || !product.isActive) {
      throw new ApiError(404, `${item.name} is no longer available`);
    }

    if (item.quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} items available for ${product.name}`);
    }
  }
};

const reduceStock = async (items) => {
  for (const item of items) {
    const productId = item.product._id || item.product;
    const result = await Product.updateOne(
      { _id: productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );

    if (result.modifiedCount !== 1) {
      throw new ApiError(409, `Stock changed for ${item.name}. Please review your cart.`);
    }
  }
};

const createOrderFromCart = async (userId, payload = {}) => {
  const cart = await getOrCreateCart(userId);

  if (cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  await validateOrderStock(cart);

  const shippingAddress = await resolveShippingAddress(userId, payload);
  const pricing = calculatePricing(cart.items, cart.couponCode);
  const orderItems = cart.items.map((item) => ({
    product: item.product._id || item.product,
    name: item.name,
    image: item.image,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.priceSnapshot,
  }));

  await reduceStock(cart.items);

  const order = await Order.create({
    orderNumber: makeOrderNumber(),
    user: userId,
    items: orderItems,
    shippingAddress,
    pricing,
    payment: {
      method: payload.paymentMethod || 'COD',
      status: payload.paymentMethod === 'ONLINE' ? 'Paid' : 'Pending',
    },
  });

  await Cart.updateOne({ user: userId }, { $set: { items: [], couponCode: '' } });

  return order;
};

const getCheckoutSummary = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return serializeCart(cart);
};

module.exports = {
  createOrderFromCart,
  getCheckoutSummary,
};
