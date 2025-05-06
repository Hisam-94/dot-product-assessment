const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

// @route   GET /api/transactions
// @desc    Get all transactions with optional filtering
// @access  Private
router.get('/', auth, getTransactions);

// @route   GET /api/transactions/:id
// @desc    Get transaction by ID
// @access  Private
router.get('/:id', auth, getTransactionById);

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, deleteTransaction);

module.exports = router; 