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
  const { page = 1, limit = 10 } = req.query;

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * pageSize;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        meta: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      'Orders fetched successfully'
    )
  );
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
