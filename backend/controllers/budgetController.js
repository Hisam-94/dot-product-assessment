const Budget = require('../models/Budget');

// @desc    Get current budget or for specified month
// @route   GET /api/budget
// @access  Private
exports.getBudget = async (req, res) => {
  try {
    // Get month from query or use current month
    let month = req.query.month;
    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    
    const budget = await Budget.findOne({
      userId: req.user.id,
      month
    });
    
    if (!budget) {
      return res.status(404).json({ message: 'No budget found for this month' });
    }
    
    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Set or update budget for a month
// @route   POST /api/budget
// @access  Private
exports.setBudget = async (req, res) => {
  try {
    const { month, amount } = req.body;
    
    // Validate required fields
    if (!month || !amount) {
      return res.status(400).json({ message: 'Please provide month and amount' });
    }
    
    // Check if month format is valid (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'Month format should be YYYY-MM' });
    }
    
    // Check if amount is valid
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Find existing budget or create new one
    let budget = await Budget.findOne({
      userId: req.user.id,
      month
    });
    
    if (budget) {
      // Update existing budget
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new budget
      budget = new Budget({
        userId: req.user.id,
        month,
        amount
      });
      await budget.save();
    }
    
    res.json(budget);
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get budget history
// @route   GET /api/budget/history
// @access  Private
exports.getBudgetHistory = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id })
      .sort({ month: -1 });
    
    res.json(budgets);
  } catch (error) {
    console.error('Get budget history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 