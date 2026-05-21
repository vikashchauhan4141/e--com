const mongoose = require('mongoose');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const ensureAdminUser = async () => {
  try {
    await connectDB();
    
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: 'vikashchauhan2921@gmail.com' });
    
    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.name} (${existingAdmin.email})`);
      
      // If for some reason the role is not admin, update it
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`Updated user role to admin for: ${existingAdmin.email}`);
      }
      process.exit(0);
    }

    // Seed the admin user since it doesn't exist
    console.log('Seeding new administrative account...');
    const newAdmin = await User.create({
      name: 'vikash admin',
      email: 'vikashchauhan2921@gmail.com',
      password: 'adminpassword123', // Default initial password
      role: 'admin',
      phone: '+919999999999',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isActive: true
    });

    console.log('Successfully created Admin account:');
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Name: ${newAdmin.name}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to configure admin details securely:', err.message);
    process.exit(1);
  }
};

ensureAdminUser();
