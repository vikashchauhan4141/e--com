const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
