const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

describe('Admin User Curation Integration Tests', () => {
  let adminToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    // Connect to isolated test database
    await mongoose.connect('mongodb://127.0.0.1:27017/stylee_ecommerce_test');
    
    // Clean database
    await User.deleteMany({});

    // Create an Admin user
    adminUser = await User.create({
      name: 'Admin Curator',
      email: 'admin@stylee.com',
      password: 'password123',
      role: 'admin',
      isActive: true
    });

    // Create a regular user
    regularUser = await User.create({
      name: 'Regular Customer',
      email: 'customer@stylee.com',
      password: 'password123',
      role: 'user',
      isActive: true
    });

    // Login as admin to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminUser.email,
        password: 'password123'
      });
    adminToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    // Drop test database and close connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should allow admin to view all users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.users.length).toBe(2);
  });

  it('should allow admin to toggle user active status', async () => {
    // Toggle active status to false (Disable)
    const res = await request(app)
      .patch(`/api/admin/users/${regularUser._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.isActive).toBe(false);

    // Verify disabled user cannot login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: regularUser.email,
        password: 'password123'
      });
    expect(loginRes.statusCode).toBe(403);
    expect(loginRes.body.message).toContain('deactivated');
  });

  it('should prevent admin from deactivating themselves', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${adminUser._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Self-deactivation');
  });

  it('should allow admin to permanently delete a user', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${regularUser._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify user is gone from search
    const searchRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(searchRes.body.data.users.length).toBe(1);
    expect(searchRes.body.data.users[0].email).toBe(adminUser.email);
  });

  it('should prevent admin from deleting themselves', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${adminUser._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Self-deletion');
  });
});
