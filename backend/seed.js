/**
 * Seed script for initializing the database with test data
 * Run with: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createTestUser } = require('./seedData');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed database with test data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create test user
    const testUserData = await createTestUser();
    const testUser = await User.create(testUserData);
    
    console.log(`Created test user: ${testUser.email}`);
    
    // Create test transactions
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const transactionData = [
      {
        userId: testUser._id,
        type: 'income',
        category: 'Salary',
        amount: 5000,
        date: new Date(),
        note: 'Monthly salary'
      },
      {
        userId: testUser._id,
        type: 'expense',
        category: 'Rent',
        amount: 1200,
        date: new Date(),
        note: 'Monthly rent'
      },
      {
        userId: testUser._id,
        type: 'expense',
        category: 'Groceries',
        amount: 300,
        date: new Date(),
        note: 'Weekly grocery shopping'
      },
      {
        userId: testUser._id,
        type: 'expense',
        category: 'Utilities',
        amount: 150,
        date: new Date(),
        note: 'Electricity and water'
      },
      {
        userId: testUser._id,
        type: 'income',
        category: 'Freelance',
        amount: 1000,
        date: new Date(),
        note: 'Web design project'
      }
    ];
    
    await Transaction.insertMany(transactionData);
    console.log(`Created ${transactionData.length} test transactions`);
    
    // Create test budget
    const budgetData = {
      userId: testUser._id,
      month: currentMonth,
      amount: 3000
    };
    
    await Budget.create(budgetData);
    console.log(`Created test budget for ${currentMonth}`);
    
    console.log('Database seeded successfully!');
    console.log('Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 