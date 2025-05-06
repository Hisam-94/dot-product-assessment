const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get financial summary for a specific month
// @route   GET /api/summary
// @access  Private
exports.getFinancialSummary = async (req, res) => {
  try {
    // Get month from query or use current month
    let month = req.query.month;
    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    
    const [year, monthNum] = month.split('-');
    
    // Get start and end date for the month
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(year, monthNum, 0); // Last day of month
    endDate.setHours(23, 59, 59, 999);
    
    // Get all transactions for the month
    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate income, expense, and balance
    let income = 0;
    let expense = 0;
    const categoryAmounts = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
        
        // Track category amounts for expense breakdown
        if (!categoryAmounts[transaction.category]) {
          categoryAmounts[transaction.category] = 0;
        }
        categoryAmounts[transaction.category] += transaction.amount;
      }
    });
    
    const balance = income - expense;
    
    // Get budget for the month
    const budget = await Budget.findOne({
      userId: req.user.id,
      month
    });
    
    // Prepare budget data
    const budgetData = {
      amount: budget ? budget.amount : 0,
      used: expense,
      remaining: budget ? budget.amount - expense : 0,
      percentageUsed: budget ? (expense / budget.amount) * 100 : 0
    };
    
    // Prepare category breakdown
    const categoryBreakdown = Object.keys(categoryAmounts).map(category => ({
      category,
      amount: categoryAmounts[category]
    })).sort((a, b) => b.amount - a.amount);
    
    res.json({
      summary: {
        income,
        expense,
        balance
      },
      budget: budgetData,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get monthly overview for a year
// @route   GET /api/summary/monthly
// @access  Private
exports.getMonthlyOverview = async (req, res) => {
  try {
    // Get year from query or use current year
    let year = req.query.year;
    if (!year) {
      year = new Date().getFullYear().toString();
    }
    
    const monthlyData = [];
    
    // Process each month
    for (let month = 1; month <= 12; month++) {
      const monthStr = String(month).padStart(2, '0');
      const monthKey = `${year}-${monthStr}`;
      
      // Get start and end date for the month
      const startDate = new Date(`${year}-${monthStr}-01`);
      const endDate = new Date(year, month, 0); // Last day of month
      endDate.setHours(23, 59, 59, 999);
      
      // Get transactions for the month
      const transactions = await Transaction.find({
        userId: req.user.id,
        date: { $gte: startDate, $lte: endDate }
      });
      
      // Calculate income and expense
      let income = 0;
      let expense = 0;
      
      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }
      });
      
      const balance = income - expense;
      
      // Get budget for the month
      const budget = await Budget.findOne({
        userId: req.user.id,
        month: monthKey
      });
      
      monthlyData.push({
        month: monthKey,
        income,
        expense,
        balance,
        budget: budget ? budget.amount : 0
      });
    }
    
    res.json(monthlyData);
  } catch (error) {
    console.error('Get monthly overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 