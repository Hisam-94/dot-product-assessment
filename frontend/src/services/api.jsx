import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Transactions API

// Get all transactions with optional filters
export const getTransactions = async (filters = {}, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.minAmount) queryParams.append('minAmount', filters.minAmount);
    if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount);
    
    // Add pagination
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const response = await axios.get(`/api/transactions?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await axios.get(`/api/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Create new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post('/api/transactions', transactionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await axios.put(`/api/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`/api/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get transactions categories
export const getTransactionsCategories = async () => {
  try {
    const response = await axios.get('/api/transactions/categories');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Budget API

// Get current month's budget
export const getCurrentBudget = async (month) => {
  try {
    const queryParams = month ? `?month=${month}` : '';
    const response = await axios.get(`/api/budget${queryParams}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No budget set
    }
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Set or update budget
export const setBudget = async (budgetData) => {
  try {
    const response = await axios.post('/api/budget', budgetData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get budget history
export const getBudgetHistory = async () => {
  try {
    const response = await axios.get('/api/budget/history');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Summary API

// Get financial summary
export const getFinancialSummary = async (month) => {
  try {
    const queryParams = month ? `?month=${month}` : '';
    const response = await axios.get(`/api/summary${queryParams}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get monthly overview
export const getMonthlyOverview = async (year) => {
  try {
    const queryParams = year ? `?year=${year}` : '';
    const response = await axios.get(`/api/summary/monthly${queryParams}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 