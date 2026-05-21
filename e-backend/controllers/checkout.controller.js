const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { getCheckoutSummary } = require('../services/order.service');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await getCheckoutSummary(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, { summary }, 'Checkout summary calculated successfully'));
});

module.exports = {
  getSummary,
};
