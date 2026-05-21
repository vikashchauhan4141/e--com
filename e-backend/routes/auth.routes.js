const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

module.exports = router;
