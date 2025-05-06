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


router.get('/', auth, getTransactions);

router.get('/:id', auth, getTransactionById);

router.post('/', auth, createTransaction);

router.put('/:id', auth, updateTransaction);

router.delete('/:id', auth, deleteTransaction);

module.exports = router; 