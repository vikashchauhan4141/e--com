const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createOrderFromCart } = require('../services/order.service');

const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderFromCart(req.user._id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, { order }, 'Order created successfully'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, { orders }, 'Orders fetched successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, { order }, 'Order fetched successfully'));
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
