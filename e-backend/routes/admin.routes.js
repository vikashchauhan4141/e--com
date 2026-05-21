const express = require('express');
const {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserPasswordAdmin,
  getCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  createAdminOrder,
} = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validations/product.validation');
const { createCategorySchema, updateCategorySchema } = require('../validations/category.validation');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getStats);

// Products CRUD
router.get('/products', getProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories CRUD
router.get('/categories', getCategoriesAdmin);
router.post('/categories', validate(createCategorySchema), createCategoryAdmin);
router.put('/categories/:id', validate(updateCategorySchema), updateCategoryAdmin);
router.delete('/categories/:id', deleteCategoryAdmin);

// Orders operations
router.get('/orders', getOrders);
router.post('/orders', createAdminOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Users management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/password', updateUserPasswordAdmin);

module.exports = router;

