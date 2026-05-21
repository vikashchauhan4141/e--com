const express = require('express');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clear,
  applyPromoCode,
  removePromoCode,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:itemId', updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clear);
router.post('/apply-coupon', applyPromoCode);
router.delete('/coupon', removePromoCode);

module.exports = router;
