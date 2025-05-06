const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getFinancialSummary,
  getMonthlyOverview
} = require('../controllers/summaryController');


router.get('/', auth, getFinancialSummary);

router.get('/monthly', auth, getMonthlyOverview);

module.exports = router; 