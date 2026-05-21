const path = require('path');
const { pathToFileURL } = require('url');
const connectDB = require('../config/db');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const slugify = require('../utils/slugify');

const loadFrontendCatalog = async () => {
  const productsPath = path.resolve(
    __dirname,
    '..',
    '..',
    'e-frontend',
    'e-com',
    'src',
    'data',
    'products.js'
  );

  const categoriesPath = path.resolve(
    __dirname,
    '..',
    '..',
    'e-frontend',
    'e-com',
    'src',
    'data',
    'categories.js'
  );

  const [{ products }, { categories }] = await Promise.all([
    import(pathToFileURL(productsPath).href),
    import(pathToFileURL(categoriesPath).href),
  ]);

  return { products, categories };
};

const seedCatalog = async () => {
  await connectDB();

  const { products, categories } = await loadFrontendCatalog();
  const categoryMap = new Map();

  for (const category of categories) {
    const savedCategory = await Category.findOneAndUpdate(
      { legacyId: category.id },
      {
        legacyId: category.id,
        name: category.name,
        slug: category.slug || slugify(category.name),
        image: category.image,
        description: category.description,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    categoryMap.set(category.name, savedCategory);
  }

  for (const product of products) {
    const category = categoryMap.get(product.category);

    if (!category) {
      throw new Error(`Missing category for product: ${product.name}`);
    }

    await Product.findOneAndUpdate(
      { legacyId: product.id },
      {
        legacyId: product.id,
        name: product.name,
        slug: slugify(product.name),
        category: category._id,
        categoryName: category.name,
        gender: product.gender,
        price: product.price,
        discountPrice: product.discountPrice || null,
        rating: product.rating,
        stock: product.stock,
        sizes: product.sizes,
        colors: product.colors,
        image: product.image,
        images: [product.image],
        description: product.description,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products`);
  process.exit(0);
};

seedCatalog().catch((error) => {
  console.error(`Catalog seed failed: ${error.message}`);
  process.exit(1);
});
