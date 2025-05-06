const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getBudget,
  setBudget,
  getBudgetHistory
} = require('../controllers/budgetController');

// @route   GET /api/budget
// @desc    Get current budget or for specified month
// @access  Private
router.get('/', auth, getBudget);

// @route   POST /api/budget
// @desc    Set or update budget for a month
// @access  Private
router.post('/', auth, setBudget);

// @route   GET /api/budget/history
// @desc    Get budget history
// @access  Private
router.get('/history', auth, getBudgetHistory);

module.exports = router; 