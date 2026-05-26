const Product = require('../models/product.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { findProductByAnyId } = require('../services/product.service');

const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    gender,
    size,
    color,
    minPrice,
    maxPrice,
    search,
    sort = 'default',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

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
  if (size) filter.sizes = size;
  if (color) filter.colors = color;

  const priceFilter = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length > 0) {
    filter.$or = [
      { discountPrice: priceFilter },
      { discountPrice: null, price: priceFilter },
    ];
  }

  if (search) {
    const cleanSearch = search.trim();
    filter.$or = [
      { name: new RegExp(cleanSearch, 'i') },
      { categoryName: new RegExp(cleanSearch, 'i') },
      { description: new RegExp(cleanSearch, 'i') }
    ];
  }

  const sortMap = {
    'price-low': { discountPrice: 1, price: 1 },
    'price-high': { discountPrice: -1, price: -1 },
    rating: { rating: -1 },
    default: { createdAt: -1 },
  };

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);
  const skip = (currentPage - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug image description')
      .sort(sortMap[sort] || sortMap.default)
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
      'Products fetched successfully'
    )
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await findProductByAnyId(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, { product }, 'Product fetched successfully'));
});

module.exports = {
  getProducts,
  getProductById,
};
