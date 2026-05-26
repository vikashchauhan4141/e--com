const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  verifyOrderPayment,
  retryOrderPayment,
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.post('/verify', verifyOrderPayment);
router.post('/:id/retry-payment', retryOrderPayment);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
