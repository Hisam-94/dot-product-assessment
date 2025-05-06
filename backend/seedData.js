/**
 * Test credentials for the Budget Tracker app
 * Use these to seed the database for testing/demo purposes
 */

const bcrypt = require('bcrypt');

const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword
  };
};

module.exports = { createTestUser }; 