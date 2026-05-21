const express = require('express');
const { getSummary } = require('../controllers/checkout.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/summary', getSummary);

module.exports = router;
