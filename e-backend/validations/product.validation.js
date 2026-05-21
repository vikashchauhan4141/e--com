const { z } = require('zod');

const productBodySchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .trim()
    .min(2, 'Product name must be at least 2 characters'),

  category: z
    .string({ required_error: 'Category ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),

  gender: z.enum(['Men', 'Women', 'Unisex'], {
    required_error: 'Gender must be Men, Women, or Unisex',
    message: 'Gender must be Men, Women, or Unisex',
  }),

  price: z
    .number({ required_error: 'Base price is required', invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),

  discountPrice: z
    .number({ invalid_type_error: 'Discount price must be a number' })
    .min(0, 'Discount price cannot be negative')
    .nullable()
    .optional(),

  stock: z
    .number({ required_error: 'Stock count is required', invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),

  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Schema for POST /admin/products
 * Validates the full product creation payload.
 */
const createProductSchema = z.object({
  body: productBodySchema,
});

/**
 * Schema for PUT /admin/products/:id
 * Validates the :id param and allows partial body updates.
 */
const updateProductSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Product ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  }),
  body: productBodySchema.partial(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
