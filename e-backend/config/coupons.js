/**
 * Centralized coupon definitions — Single Source of Truth.
 * Import this file in pricing.js, cart.service.js, and any API endpoint
 * that needs to validate or enumerate coupons.
 *
 * To add a new coupon, add ONE entry here. Nowhere else.
 */
const COUPONS = [
  { code: 'STYLEE10',   discountPercent: 10, freeShipping: false },
  { code: 'LAVENDER10', discountPercent: 10, freeShipping: false },
  { code: 'AURA10',     discountPercent: 10, freeShipping: false },
  { code: 'FREESHIP',   discountPercent: 0,  freeShipping: true  },
];

/** All valid coupon code strings (normalized, uppercase). */
const VALID_COUPON_CODES = COUPONS.map((c) => c.code);

/**
 * Look up coupon details by code.
 * @param {string} code - Raw coupon string (any casing)
 * @returns {object|null} Coupon config or null if invalid
 */
const findCoupon = (code = '') => {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized) || null;
};

module.exports = { COUPONS, VALID_COUPON_CODES, findCoupon };
