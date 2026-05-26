const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const addressRoutes = require('./address.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const wishlistRoutes = require('./wishlist.routes');
const checkoutRoutes = require('./checkout.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');
const couponRoutes = require('./coupon.routes');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        service: 'stylee-ecommerce-api',
        status: 'healthy',
      },
      'Backend is running'
    )
  );
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', orderRoutes);
router.use('/admin/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);

module.exports = router;
