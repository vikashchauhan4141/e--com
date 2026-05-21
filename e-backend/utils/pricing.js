const FREE_SHIPPING_MINIMUM = 5000;
const STANDARD_SHIPPING = 150;

const normalizeCoupon = (code = '') => code.trim().toUpperCase();

const getCouponDiscount = (subtotal, couponCode) => {
  const code = normalizeCoupon(couponCode);

  if (['STYLEE10', 'LAVENDER10', 'AURA10'].includes(code)) {
    return {
      code,
      discount: Math.round(subtotal * 0.1),
      discountPercent: 10,
      freeShipping: false,
    };
  }

  if (code === 'FREESHIP') {
    return {
      code,
      discount: 0,
      discountPercent: 0,
      freeShipping: true,
    };
  }

  return {
    code: '',
    discount: 0,
    discountPercent: 0,
    freeShipping: false,
  };
};

const calculatePricing = (items, couponCode = '') => {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.priceSnapshot * item.quantity;
  }, 0);

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
};
