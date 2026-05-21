const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phone: z.string().trim().optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email format'),
  })
});

const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string({ required_error: 'Reset token is required' }),
  }),
  body: z.object({
    newPassword: z.string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters'),
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
