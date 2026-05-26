const crypto = require('crypto');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/user.model');
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  // NOTE: We respond with the same 200 message whether or not the email exists.
  // This prevents user enumeration attacks (OWASP A07).
  if (user) {
    // 1. Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash token and save to DB with 10-minute expiry
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // 3. Construct reset URL
    const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;

    // 4. Send transactional email (fire and forget)
    emailService.sendPasswordResetEmail(user, resetUrl).catch((err) => {
      console.error('Failed to send password reset email:', err);
    });
  }

  res.status(200).json(new ApiResponse(200, null, 'If an account with this email exists, a password reset link has been sent.'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, 'New password is required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  // Hash the incoming parameter token to match stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with active token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  // Set new password (triggers Mongoose hash pre-save hook) and clear reset fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successfully'));
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
