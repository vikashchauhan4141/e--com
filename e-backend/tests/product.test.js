const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

describe('Product Integration Tests', () => {
  let categoryId;
  let testProductId;

  beforeAll(async () => {
    // Connect to isolated test database
    await mongoose.connect('mongodb://127.0.0.1:27017/stylee_ecommerce_test');
    
    // Clean collections
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create a dummy Category tag
    const cat = await Category.create({
      name: 'Outerwear',
      legacyId: 101,
      isActive: true
    });
    categoryId = cat._id;

    // Create 3 active products
    const p1 = await Product.create({
      name: 'Premium Wool Overcoat',
      legacyId: 1001,
      category: categoryId,
      categoryName: 'Outerwear',
      gender: 'Unisex',
      price: 9999,
      stock: 12,
      sizes: ['M', 'L'],
      colors: ['Charcoal', 'Navy'],
      isActive: true
    });
    testProductId = p1._id;

    await Product.create({
      name: 'Cashmere Knit Beanie',
      legacyId: 1002,
      category: categoryId,
      categoryName: 'Outerwear',
      gender: 'Unisex',
      price: 1999,
      stock: 45,
      sizes: ['One Size'],
      colors: ['Beige'],
      isActive: true
    });

    await Product.create({
      name: 'Cropped Denim Jacket',
      legacyId: 1003,
      category: categoryId,
      categoryName: 'Outerwear',
      gender: 'Women',
      price: 4999,
      stock: 5,
      sizes: ['S', 'M'],
      colors: ['Blue'],
      isActive: true
    });
  });

  afterAll(async () => {
    // Drop test database and close connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should fetch public products list with default pagination', async () => {
    const res = await request(app)
      .get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBe(3);
    expect(res.body.data).toHaveProperty('meta');
    expect(res.body.data.meta.page).toBe(1);
    expect(res.body.data.meta.limit).toBe(12);
  });

  it('should apply limit and page parameters correctly', async () => {
    const res = await request(app)
      .get('/api/products?limit=2&page=1');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBe(2);
    expect(res.body.data.meta.limit).toBe(2);
    expect(res.body.data.meta.totalPages).toBe(2);
  });

  it('should filter products by gender query', async () => {
    const res = await request(app)
      .get('/api/products?gender=Women');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBe(1);
    expect(res.body.data.products[0].name).toBe('Cropped Denim Jacket');
  });

  it('should fetch product details by legacyId or _id', async () => {
    const res = await request(app)
      .get(`/api/products/${testProductId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.name).toBe('Premium Wool Overcoat');
  });
});
