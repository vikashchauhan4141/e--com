const Address = require('../models/address.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');
const { calculatePricing } = require('../utils/pricing');
const { getOrCreateCart, serializeCart } = require('./cart.service');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('../config/env');

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

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

  let order;
  try {
    order = await Order.create({
      orderNumber: makeOrderNumber(),
      user: userId,
      items: orderItems,
      shippingAddress,
      pricing,
      payment: {
        method: payload.paymentMethod || 'COD',
        status: 'Pending',
      },
    });

    if (payload.paymentMethod === 'ONLINE') {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(pricing.total * 100), // amount in paisa (sub-units)
          currency: 'INR',
          receipt: order._id.toString(),
        });

        order.payment.razorpayOrderId = razorpayOrder.id;
        await order.save();

        // Convert to plain object to attach razorpayOrder details dynamically
        const orderObj = order.toObject();
        orderObj.razorpayOrder = {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: env.razorpayKeyId,
        };
        
        // Return this plain object with razorpay details
        order = orderObj;
      } catch (rzpErr) {
        console.error('Razorpay order initialization failed:', rzpErr);
        // Rollback stock
        for (const item of cart.items) {
          await Product.updateOne(
            { _id: item.product._id || item.product },
            { $inc: { stock: item.quantity } }
          );
        }
        // Cleanup draft order from DB
        await Order.deleteOne({ _id: order._id });
        throw new ApiError(522, 'Payment gateway failed to initialize. Please try again.');
      }
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || 'Failed to place order');
  }

  // Clear shopping cart on successful placement/initialization
  await Cart.updateOne({ user: userId }, { $set: { items: [], couponCode: '' } });

  // Only trigger order confirmation email immediately for Cash on Delivery
  if (payload.paymentMethod === 'COD') {
    User.findById(userId)
      .then((user) => {
        if (user) {
          emailService.sendOrderConfirmationEmail(user, order).catch((err) => {
            console.error('Failed to send COD order confirmation email:', err);
          });
        }
      })
      .catch((err) => {
        console.error('Failed to look up user for order confirmation email:', err);
      });
  }

  return order;
};

const verifyPayment = async ({ orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature }) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.payment.status === 'Paid') {
    return order; // Already processed
  }

  // Verify HMAC-SHA256 signature securely using the secret key
  const generatedSignature = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    order.payment.status = 'Failed';
    await order.save();
    throw new ApiError(400, 'Invalid payment signature. Verification failed.');
  }

  // Success: Update payment details and status
  order.payment.status = 'Paid';
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  await order.save();

  // Trigger invoice email asynchronously now that payment is confirmed
  User.findById(order.user)
    .then((user) => {
      if (user) {
        emailService.sendOrderConfirmationEmail(user, order).catch((err) => {
          console.error('Failed to send order confirmation email after verification:', err);
        });
      }
    })
    .catch((err) => {
      console.error('Failed to look up user for order confirmation email:', err);
    });

  return order;
};

const reinitiatePayment = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.payment.status === 'Paid') {
    throw new ApiError(400, 'This order has already been paid');
  }

  if (order.payment.method !== 'ONLINE') {
    throw new ApiError(400, 'Only online orders can re-initiate payments');
  }

  // Create a new Razorpay order to guarantee it hasn't expired since drafting
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.pricing.total * 100), // amount in paisa
    currency: 'INR',
    receipt: order._id.toString(),
  });

  order.payment.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: env.razorpayKeyId,
    },
    order,
  };
};

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.status === 'Cancelled') {
    throw new ApiError(400, 'Order is already cancelled');
  }

  if (order.status === 'Shipped' || order.status === 'Delivered') {
    throw new ApiError(400, 'Cannot cancel order after it has been shipped or delivered');
  }

  // Restore inventory stock for all products in this order
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } }
    );
  }

  order.status = 'Cancelled';
  if (order.payment.status === 'Pending') {
    order.payment.status = 'Failed';
  }
  await order.save();

  return order;
};

const getCheckoutSummary = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return serializeCart(cart);
};

module.exports = {
  createOrderFromCart,
  verifyPayment,
  reinitiatePayment,
  cancelOrder,
  getCheckoutSummary,
};
