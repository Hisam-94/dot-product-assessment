import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getTransactions,
  deleteTransaction, 
  setFilters,
  clearFilters
} from '../store/slices/transactionSlice';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const dispatch = useDispatch();
  const { 
    transactions, 
    categories, 
    loading, 
    error, 
    pagination,
    filters: storeFilters
  } = useSelector(state => state.transactions);
  
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });
  
  // Fetch transactions and categories
  useEffect(() => {
    dispatch(getTransactions({}));
  }, [dispatch]);
  
  // Handle opening modal for adding transaction
  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setShowModal(true);
  };
  
  // Handle opening modal for editing transaction
  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setShowModal(true);
  };
  
  // Handle transaction deletion
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const filtersToApply = {};
    
    if (localFilters.type !== 'all') {
      filtersToApply.type = localFilters.type;
    }
    
    if (localFilters.category !== 'all') {
      filtersToApply.category = localFilters.category;
    }
    
    if (localFilters.startDate) {
      filtersToApply.startDate = localFilters.startDate;
    }
    
    if (localFilters.endDate) {
      filtersToApply.endDate = localFilters.endDate;
    }
    
    dispatch(setFilters(filtersToApply));
    dispatch(getTransactions({ filters: filtersToApply }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setLocalFilters({
      type: 'all',
      category: 'all',
      search: '',
      startDate: '',
      endDate: ''
    });
    dispatch(clearFilters());
    dispatch(getTransactions({}));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };
  
  // Handle modal close
  const handleModalClose = (refreshData = false) => {
    setShowModal(false);
    setCurrentTransaction(null);
    
    if (refreshData) {
      dispatch(getTransactions({ filters: storeFilters }));
    }
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(getTransactions({ 
      filters: storeFilters,
      page,
      limit: pagination.limit
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Transactions</h1>
        <button
          onClick={handleAddTransaction}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Add Transaction
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-secondary-700 mb-4">Filters</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary-600 mb-1">Type</label>
            <select
              name="type"
              value={localFilters.type}
              onChange={handleFilterChange}
              className="w-full border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary-600 mb-1">Category</label>
            <select
              name="category"
              value={localFilters.category}
              onChange={handleFilterChange}
              className="w-full border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-secondary-600 mb-1">From</label>
            <input
              type="date"
              name="startDate"
              value={localFilters.startDate}
              onChange={handleFilterChange}
              className="w-full border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-600 mb-1">To</label>
            <input
              type="date"
              name="endDate"
              value={localFilters.endDate}
              onChange={handleFilterChange}
              className="w-full border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-secondary-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-secondary-600">No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {transactions.map(transaction => (
                  <tr key={transaction._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500 max-w-xs truncate">
                      {transaction.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 flex justify-between items-center border-t border-secondary-200">
            <div className="text-sm text-secondary-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === 1
                    ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === pagination.pages
                    ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={currentTransaction}
          onClose={handleModalClose}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Transactions; 