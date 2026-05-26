const { findCoupon } = require('../config/coupons');

const FREE_SHIPPING_MINIMUM = 5000;
const STANDARD_SHIPPING = 150;

/** Normalizes a raw coupon string to match stored keys. */
const normalizeCoupon = (code = '') => code.trim().toUpperCase();

/**
 * Resolves discount details for a given subtotal + coupon code.
 * Uses the centralized coupons config — no hardcoded lists here.
 */
const getCouponDiscount = (subtotal, couponCode) => {
  const coupon = findCoupon(couponCode);

  if (!coupon) {
    return { code: '', discount: 0, discountPercent: 0, freeShipping: false };
  }

  return {
    code: coupon.code,
    discount: coupon.discountPercent > 0 ? Math.round(subtotal * coupon.discountPercent / 100) : 0,
    discountPercent: coupon.discountPercent,
    freeShipping: coupon.freeShipping,
  };
};

/**
 * Calculates full order pricing from cart items and an optional coupon.
 * @param {Array<{priceSnapshot: number, quantity: number}>} items
 * @param {string} couponCode
 */
const calculatePricing = (items, couponCode = '') => {
  const subtotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  const coupon = getCouponDiscount(subtotal, couponCode);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MINIMUM || coupon.freeShipping
    ? 0
    : STANDARD_SHIPPING;

  return {
    subtotal,
    shipping,
    discount: coupon.discount,
    discountPercent: coupon.discountPercent,
    couponCode: coupon.code,
    total: Math.max(subtotal + shipping - coupon.discount, 0),
  };
};

module.exports = {
  calculatePricing,
  normalizeCoupon,
  FREE_SHIPPING_MINIMUM,
  STANDARD_SHIPPING,
};
