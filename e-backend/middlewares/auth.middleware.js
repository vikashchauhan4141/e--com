const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.accessToken;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new ApiError(401, 'User linked to this token no longer exists');
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
