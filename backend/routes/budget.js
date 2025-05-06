const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getBudget,
  setBudget,
  getBudgetHistory
} = require('../controllers/budgetController');


router.get('/', auth, getBudget);

router.post('/', auth, setBudget);

router.get('/history', auth, getBudgetHistory);

module.exports = router; 