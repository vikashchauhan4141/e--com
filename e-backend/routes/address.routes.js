const express = require('express');
const {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getAddresses);
router.post('/', addAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

module.exports = router;
