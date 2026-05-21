const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Connect to isolated test database
    await mongoose.connect('mongodb://127.0.0.1:27017/stylee_ecommerce_test');
    // Clean database before starting
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Drop test database and close connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  const testUser = {
    name: 'Test Curation',
    email: 'curator@stylee.com',
    password: 'password123',
    phone: '9876543210'
  };

  it('should successfully register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('_id');
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data).toHaveProperty('token');
  });

  it('should prevent registration with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should successfully login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe(testUser.name);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should get current user profile with valid token', async () => {
    // First, login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    const token = loginRes.body.data.token;

    // Fetch profile using token in Authorization header
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it('should successfully update own password and allow login with new password', async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    const token = loginRes.body.data.token;

    // Update password
    const updateRes = await request(app)
      .patch('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: testUser.password,
        newPassword: 'newsecurepassword123'
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.message).toContain('Password updated successfully');

    // Attempt login with old password (should fail)
    const oldLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    expect(oldLoginRes.statusCode).toBe(401);

    // Attempt login with new password (should succeed)
    const newLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'newsecurepassword123'
      });
    expect(newLoginRes.statusCode).toBe(200);
    expect(newLoginRes.body.success).toBe(true);
  });

  it('should reject password update if current password is wrong', async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'newsecurepassword123'
      });
    const token = loginRes.body.data.token;

    // Update password with incorrect current password
    const updateRes = await request(app)
      .patch('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'anothernewpassword123'
      });

    expect(updateRes.statusCode).toBe(401);
    expect(updateRes.body.success).toBe(false);
  });
});
