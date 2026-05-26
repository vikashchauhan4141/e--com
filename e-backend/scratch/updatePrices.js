const mongoose = require('mongoose');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

const updatePrices = async () => {
  console.log('Connecting to database...');
  await connectDB();
  
  try {
    console.log('Updating product prices...');
    const result = await Product.updateMany(
      {},
      { 
        $set: { 
          price: 1, 
          discountPrice: null 
        } 
      }
    );
    console.log(`Success! Updated ${result.modifiedCount} products to ₹1.`);
  } catch (error) {
    console.error('Failed to update product prices:', error);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Done.');
  }
};

updatePrices();
