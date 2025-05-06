import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction, updateTransaction } from '../store/slices/transactionSlice';

const commonCategories = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Travel', 'Other']
};

const TransactionModal = ({ transaction, onClose, categories }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.transactions);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  
  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  // Set form data if editing an existing transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: new Date(transaction.date).toISOString().split('T')[0],
        note: transaction.note || ''
      });
      
      // Check if it's a custom category
      const isCustomCategory = !commonCategories[transaction.type].includes(transaction.category);
      if (isCustomCategory) {
        setShowCustomCategory(true);
        setCustomCategory(transaction.category);
      }
    }
  }, [transaction]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user changes input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Handle category select change
    if (name === 'category' && value === 'custom') {
      setShowCustomCategory(true);
    } else if (name === 'category') {
      setShowCustomCategory(false);
      setFormData({
        ...formData,
        category: value
      });
    } else if (name === 'type') {
      // Reset category when type changes
      setFormData({
        ...formData,
        type: value,
        category: ''
      });
      setShowCustomCategory(false);
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle custom category input
  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    
    // Update form data with custom category
    setFormData({
      ...formData,
      category: e.target.value
    });
  };
  
  // Validate form
  const validateForm = () => {
    const validationErrors = {};
    
    if (!formData.type) {
      validationErrors.type = 'Transaction type is required';
    }
    
    if (!formData.category) {
      validationErrors.category = 'Category is required';
    }
    
    if (!formData.amount) {
      validationErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      validationErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      validationErrors.date = 'Date is required';
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert amount to number
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    try {
      if (transaction) {
        // Update existing transaction
        await dispatch(updateTransaction({ 
          id: transaction._id, 
          transactionData 
        }));
      } else {
        // Create new transaction
        await dispatch(createTransaction(transactionData));
      }
      
      // Close modal and refresh transactions
      onClose(true);
    } catch (err) {
      console.error('Transaction save error:', err);
    }
  };
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Transaction Type */}
              <div className="mb-4">
                <label className="block text-secondary-700 text-sm font-medium mb-2">
                  Transaction Type
                </label>
                <div className="flex">
                  <label className="inline-flex items-center mr-6">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-secondary-700">Income</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-secondary-700">Expense</span>
                  </label>
                </div>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-secondary-700 text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={showCustomCategory ? 'custom' : formData.category}
                  onChange={handleChange}
                  className={`w-full border rounded py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.category ? 'border-red-500' : 'border-secondary-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {formData.type && commonCategories[formData.type].map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">+ Add Custom Category</option>
                </select>
                {showCustomCategory && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    placeholder="Enter custom category"
                    className="mt-2 w-full border border-secondary-300 rounded py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                )}
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
              
              {/* Amount */}
              <div className="mb-4">
                <label className="block text-secondary-700 text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-secondary-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 border rounded py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.amount ? 'border-red-500' : 'border-secondary-300'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>
              
              {/* Date */}
              <div className="mb-4">
                <label className="block text-secondary-700 text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full border rounded py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.date ? 'border-red-500' : 'border-secondary-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>
              
              {/* Note */}
              <div className="mb-4">
                <label className="block text-secondary-700 text-sm font-medium mb-2">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add a note about this transaction"
                  rows="2"
                  className="w-full border border-secondary-300 rounded py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="bg-white border border-secondary-300 text-secondary-700 rounded-md py-2 px-4 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : transaction ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 