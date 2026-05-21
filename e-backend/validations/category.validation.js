const { z } = require('zod');

const categoryBodySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(2, 'Category name must be at least 2 characters'),

  image: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Schema for POST /admin/categories
 * Validates the full category creation payload.
 */
const createCategorySchema = z.object({
  body: categoryBodySchema,
});

/**
 * Schema for PUT /admin/categories/:id
 * Validates the :id param and allows partial body updates.
 */
const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Category ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),
  }),
  body: categoryBodySchema.partial(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
