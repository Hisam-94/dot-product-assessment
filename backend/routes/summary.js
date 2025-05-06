const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getFinancialSummary,
  getMonthlyOverview
} = require('../controllers/summaryController');

// @route   GET /api/summary
// @desc    Get financial summary for a specific month
// @access  Private
router.get('/', auth, getFinancialSummary);

// @route   GET /api/summary/monthly
// @desc    Get monthly overview for a year
// @access  Private
router.get('/monthly', auth, getMonthlyOverview);

module.exports = router; 