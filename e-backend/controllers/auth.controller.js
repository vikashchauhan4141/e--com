const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { registerUser, loginUser } = require('../services/auth.service');
const emailService = require('../services/email.service');


const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendAuthResponse = (res, statusCode, user, message) => {
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  res
    .status(statusCode)
    .cookie('accessToken', token, cookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        {
          user,
          token,
        },
        message
      )
    );
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const user = await registerUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone,
  });

  // Trigger welcome email in background
  emailService.sendWelcomeEmail(user).catch((err) => {
    console.error('Failed to send welcome email:', err);
  });

  sendAuthResponse(res, 201, user, 'Account created successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await loginUser({
    email: email.trim().toLowerCase(),
    password,
  });

  sendAuthResponse(res, 200, user, 'Logged in successfully');
});

const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, 'Current user fetched successfully'));
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
