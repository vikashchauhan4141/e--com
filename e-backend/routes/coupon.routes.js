const express = require('express');
const { COUPONS } = require('../config/coupons');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

/**
 * @desc  Get all active promo codes (public — used by guest cart)
 * @route GET /api/coupons
 * @access Public
 */
router.get('/', (req, res) => {
  // Only expose code + discountPercent + freeShipping — no internal fields
  const publicCoupons = COUPONS.map(({ code, discountPercent, freeShipping }) => ({
    code,
    discountPercent,
    freeShipping,
  }));

  res.status(200).json(
    new ApiResponse(200, { coupons: publicCoupons }, 'Promo codes fetched successfully')
  );
});

module.exports = router;
