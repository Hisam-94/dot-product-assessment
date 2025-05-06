const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budget');
const summaryRoutes = require('./routes/summary');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Enable CORS
const alledOrigins = ['http://localhost:3000', 'https://dot-product-assessment-cjzm.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (alledOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/summary', summaryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Budget Tracker API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 