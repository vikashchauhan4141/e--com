const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Category = require('../models/category.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculatePricing } = require('../utils/pricing');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  // Aggregate total revenue for non-cancelled orders
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // Counts
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalUsers = await User.countDocuments();

  // Out of stock and low stock products
  const lowStockProducts = await Product.find({ stock: { $lt: 5 } })
    .populate('category', 'name')
    .limit(10);
  const outOfStockCount = await Product.countDocuments({ stock: 0 });

  // Order status counts
  const orderStatuses = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const statusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orderStatuses.forEach((item) => {
    if (statusCounts[item._id] !== undefined) {
      statusCounts[item._id] = item.count;
    }
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCategories,
        totalUsers,
        lowStockProducts,
        outOfStockCount,
        statusCounts,
      },
      'Admin metrics aggregated successfully'
    )
  );
});

// @desc    Get all products (including inactive ones)
// @route   GET /api/admin/products
// @access  Private/Admin
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, gender, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      filter.category = category;
    } else {
      const Category = require('../models/category.model');
      const catDoc = await Category.findOne({
        $or: [
          { name: new RegExp(`^${category}$`, 'i') },
          { slug: new RegExp(`^${category}$`, 'i') }
        ]
      });
      
      if (catDoc) {
        filter.$or = [
          { category: catDoc._id },
          { categoryName: catDoc.name }
        ];
      } else {
        filter.categoryName = new RegExp(`^${category}$`, 'i');
      }
    }
  }
  if (gender) filter.gender = gender;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { categoryName: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        meta: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      'Products catalog fetched successfully'
    )
  );
});

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    gender,
    price,
    discountPrice,
    stock,
    sizes,
    colors,
    image,
    description,
    isActive,
  } = req.body;

  if (!name || !category || !gender || price === undefined || stock === undefined) {
    throw new ApiError(400, 'Missing required fields');
  }

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    throw new ApiError(404, 'Category not found');
  }

  // Auto-generate legacyId
  const maxProduct = await Product.findOne().sort({ legacyId: -1 });
  const nextLegacyId = maxProduct && maxProduct.legacyId ? maxProduct.legacyId + 1 : 1000;

  const product = await Product.create({
    legacyId: nextLegacyId,
    name,
    category,
    categoryName: categoryDoc.name,
    gender,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : null,
    stock: Number(stock),
    sizes: Array.isArray(sizes) ? sizes : [],
    colors: Array.isArray(colors) ? colors : [],
    image: image || '',
    description: description || '',
    isActive: isActive !== undefined ? isActive : true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { product }, 'Product created successfully'));
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    gender,
    price,
    discountPrice,
    stock,
    sizes,
    colors,
    image,
    description,
    isActive,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (category && category !== product.category.toString()) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      throw new ApiError(404, 'Category not found');
    }
    product.category = category;
    product.categoryName = categoryDoc.name;
  }

  if (name !== undefined) product.name = name;
  if (gender !== undefined) product.gender = gender;
  if (price !== undefined) product.price = Number(price);
  if (discountPrice !== undefined) {
    product.discountPrice = discountPrice ? Number(discountPrice) : null;
  }
  if (stock !== undefined) product.stock = Number(stock);
  if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : [];
  if (colors !== undefined) product.colors = Array.isArray(colors) ? colors : [];
  if (image !== undefined) product.image = image;
  if (description !== undefined) product.description = description;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, { product }, 'Product updated successfully'));
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Product deleted successfully'));
});

// @desc    Get all customer orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * pageSize;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Order.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        meta: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      'Orders fetched successfully'
    )
  );
});

// @desc    Update order status or payment status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (status) order.status = status;
  if (paymentStatus) order.payment.status = paymentStatus;

  // Auto pay for delivered cash on delivery orders
  if (status === 'Delivered' && order.payment.method === 'COD') {
    order.payment.status = 'Paid';
  }

  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, { order }, 'Order status updated successfully'));
});

// @desc    Delete an order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Business Guard: Only allow deleting cancelled orders to preserve ledger integrity
  if (order.status !== 'Cancelled') {
    throw new ApiError(400, 'Only cancelled orders can be removed from history');
  }

  await Order.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Order deleted successfully'));
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * pageSize;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        meta: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      'Users fetched successfully'
    )
  );
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role value');
  }

  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'Self-demotion or modifying your own role is not allowed');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.role = role;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, { user }, 'User role updated successfully'));
});

// @desc    Update user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (isActive === undefined) {
    throw new ApiError(400, 'isActive field is required');
  }

  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'Self-deactivation or modifying your own active status is blocked');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = isActive;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, { user }, 'User active status updated successfully'));
});

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'Self-deletion or de-registering your own console session is blocked');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'User permanently deleted successfully'));
});

// @desc    Force reset user password by admin
// @route   PATCH /api/admin/users/:id/password
// @access  Private/Admin
const updateUserPasswordAdmin = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, 'New password is required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'Self-password reset is blocked. Please change your password from the profile page.');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, 'User password reset successfully'));
});

// @desc    Get all categories (including inactive ones)
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(
    new ApiResponse(200, { categories }, 'All categories fetched successfully')
  );
});

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategoryAdmin = asyncHandler(async (req, res) => {
  const { name, image, description, isActive } = req.body;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  const existingCategory = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  // Generate legacyId
  const maxCategory = await Category.findOne().sort({ legacyId: -1 });
  const nextLegacyId = maxCategory && maxCategory.legacyId ? maxCategory.legacyId + 1 : 100;

  const category = await Category.create({
    legacyId: nextLegacyId,
    name,
    image: image || '',
    description: description || '',
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json(
    new ApiResponse(201, { category }, 'Category created successfully')
  );
});

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategoryAdmin = asyncHandler(async (req, res) => {
  const { name, image, description, isActive } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const oldName = category.name;

  if (name !== undefined) {
    if (name.toLowerCase() !== oldName.toLowerCase()) {
      const existingCategory = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
      if (existingCategory) {
        throw new ApiError(400, 'Category with this name already exists');
      }
    }
    category.name = name;
    category.slug = undefined; // Slug will regenerate via pre-validate hook
  }

  if (image !== undefined) category.image = image;
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  // Keep product denormalized categoryName in sync after a rename
  if (name !== undefined && name.toLowerCase() !== oldName.toLowerCase()) {
    await Product.updateMany(
      { category: category._id },
      { $set: { categoryName: category.name } }
    );
  }

  res.status(200).json(
    new ApiResponse(200, { category }, 'Category updated successfully')
  );
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategoryAdmin = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'Category deleted successfully')
  );
});

// @desc    Create order directly by admin on behalf of a user
// @route   POST /api/admin/orders
// @access  Private/Admin
const createAdminOrder = asyncHandler(async (req, res) => {
  const { userId, items, shippingAddress, paymentMethod, paymentStatus, status, couponCode } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
    throw new ApiError(400, 'Missing required fields for admin order creation');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const orderItems = [];
  
  // Stock validation and structure compilation
  for (const item of items) {
    const { productId, size, color, quantity } = item;
    
    if (!productId || !quantity || quantity <= 0) {
      throw new ApiError(400, 'Each item must have a valid productId and quantity');
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, `Product not found or inactive: ${productId}`);
    }

    if (product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`);
    }

    const price = product.discountPrice || product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      size: size || 'M',
      color: color || 'Black',
      quantity: Number(quantity),
      price: Number(price)
    });
  }

  // Deduct stock atomically
  for (const item of orderItems) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );

    if (result.modifiedCount !== 1) {
      throw new ApiError(409, `Stock changed for ${item.name} during processing. Please retry.`);
    }
  }

  // Calculate pricing
  const pricingItems = orderItems.map(item => ({
    priceSnapshot: item.price,
    quantity: item.quantity
  }));

  const pricing = calculatePricing(pricingItems, couponCode || '');

  // Generate order number
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const order = await Order.create({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress,
    pricing,
    payment: {
      method: paymentMethod || 'COD',
      status: paymentStatus || (paymentMethod === 'ONLINE' ? 'Paid' : 'Pending')
    },
    status: status || 'Processing'
  });

  res.status(201).json(
    new ApiResponse(201, { order }, 'Admin placed order successfully')
  );
});

module.exports = {
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
};
