const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true,
    // Format: YYYY-MM
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid month format. Use YYYY-MM.`
    }
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Ensure userId and month combination is unique
BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema); 