const mongoose = require('mongoose');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const updateAdmin = async () => {
  try {
    await connectDB();
    
    // 1. Safely lookup by the exact target dummy credentials to prevent loose matching or corruption
    const dummyAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@stylee.com' },
        { name: 'Atelier Admin' }
      ]
    });
    
    if (dummyAdmin) {
      console.log(`Found Dummy Admin: ${dummyAdmin.name} (${dummyAdmin.email})`);
      
      // Update dummy credentials safely to new values
      dummyAdmin.email = 'vikashchauhan2921@gmail.com';
      dummyAdmin.name = 'vikash admin';
      
      await dummyAdmin.save();
      
      console.log('Successfully updated Dummy Admin to new credentials:');
      console.log(`New Email: ${dummyAdmin.email}`);
      console.log(`New Name: ${dummyAdmin.name}`);
      process.exit(0);
    }

    // 2. Check if a migrated admin already exists in the system
    const migratedAdmin = await User.findOne({ email: 'vikashchauhan2921@gmail.com' });
    if (migratedAdmin) {
      console.log(`Migrated Admin already exists: ${migratedAdmin.name} (${migratedAdmin.email})`);
      process.exit(0);
    }

    // 3. Fallback: If no admin accounts exist at all, seed the initial admin account safely
    const anyAdmin = await User.findOne({ role: 'admin' });
    if (!anyAdmin) {
      console.log('No admin users found. Seeding new default admin account...');
      
      const newAdmin = await User.create({
        name: 'vikash admin',
        email: 'vikashchauhan2921@gmail.com',
        password: 'adminpassword123', // Default initial password
        role: 'admin',
        phone: '+919999999999',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isActive: true
      });

      console.log('Successfully seeded default Admin account:');
      console.log(`Email: ${newAdmin.email}`);
      console.log(`Name: ${newAdmin.name}`);
      process.exit(0);
    }

    console.log('An administrative account already exists. No action required.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to migrate admin details securely:', err.message);
    process.exit(1);
  }
};

updateAdmin();
