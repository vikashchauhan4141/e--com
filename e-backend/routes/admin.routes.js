const express = require('express');
const {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getUsers,
  updateUserRole,
  getCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  createAdminOrder,
} = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getStats);

// Products CRUD
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories CRUD
router.get('/categories', getCategoriesAdmin);
router.post('/categories', createCategoryAdmin);
router.put('/categories/:id', updateCategoryAdmin);
router.delete('/categories/:id', deleteCategoryAdmin);

// Orders operations
router.get('/orders', getOrders);
router.post('/orders', createAdminOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// Users management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
