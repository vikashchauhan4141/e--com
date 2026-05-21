const express = require('express');
const authRoutes = require('./auth.routes');
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

module.exports = router;
