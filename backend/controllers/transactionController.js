const Transaction = require('../models/Transaction');

// @desc    Get all transactions with optional filtering
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { userId: req.user.id };
    
    // Add filters to query if provided
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Transaction.countDocuments(query);
    
    // Calculate total pages
    const pages = Math.ceil(total / limit);
    
    res.json({
      transactions,
      pagination: {
        total,
        pages,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, note } = req.body;
    
    // Validate required fields
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: 'Please provide type, category, amount, and date' });
    }
    
    // Create transaction
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      category,
      amount,
      date,
      note
    });
    
    await transaction.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, note } = req.body;
    
    // Build update object
    const updateFields = {};
    if (type) updateFields.type = type;
    if (category) updateFields.category = category;
    if (amount) updateFields.amount = amount;
    if (date) updateFields.date = date;
    if (note !== undefined) updateFields.note = note;
    
    // Find and update
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await Transaction.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 