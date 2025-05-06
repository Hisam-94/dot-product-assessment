import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initial state
const initialState = {
  transactions: [],
  currentTransaction: null,
  categories: [],
  pagination: {
    total: 0,
    pages: 0,
    page: 1,
    limit: 10
  },
  filters: {
    type: null,
    category: null,
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null
  },
  loading: false,
  error: null
};

// Async thunks for transaction operations
export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async ({ filters = {}, page = 1, limit = 10 }, { rejectWithValue }) => {
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
      
      const response = await axios.get(`${url}/api/transactions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const getTransactionById = createAsyncThunk(
  'transactions/getTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/transactions`, transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/api/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/api/transactions/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
);

export const getTransactionsCategories = createAsyncThunk(
  'transactions/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/transactions/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

// Transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: null,
        category: null,
        startDate: null,
        endDate: null,
        minAmount: null,
        maxAmount: null
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
      //   [
      //     {
      //         "_id": "6818daa52a45b7191da15141",
      //         "userId": "6818d9cf2a45b7191da15078",
      //         "type": "income",
      //         "category": "Salary",
      //         "amount": 500,
      //         "date": "2025-05-06T00:00:00.000Z",
      //         "note": "My monthly salary",
      //         "createdAt": "2025-05-05T15:35:01.606Z",
      //         "updatedAt": "2025-05-05T15:35:01.606Z",
      //         "__v": 0
      //     },
      //     {
      //         "_id": "6818da662a45b7191da1513d",
      //         "userId": "6818d9cf2a45b7191da15078",
      //         "type": "income",
      //         "category": "Freelance",
      //         "amount": 190,
      //         "date": "2025-05-05T00:00:00.000Z",
      //         "note": "Income from freelance",
      //         "createdAt": "2025-05-05T15:33:58.467Z",
      //         "updatedAt": "2025-05-05T15:33:58.467Z",
      //         "__v": 0
      //     },
      //     {
      //         "_id": "6818dafd2a45b7191da1517d",
      //         "userId": "6818d9cf2a45b7191da15078",
      //         "type": "expense",
      //         "category": "Shopping",
      //         "amount": 100,
      //         "date": "2025-05-05T00:00:00.000Z",
      //         "note": "Bought some clothes for myself.",
      //         "createdAt": "2025-05-05T15:36:29.989Z",
      //         "updatedAt": "2025-05-05T15:36:29.989Z",
      //         "__v": 0
      //     },
      //     {
      //         "_id": "6818db3f2a45b7191da151c5",
      //         "userId": "6818d9cf2a45b7191da15078",
      //         "type": "expense",
      //         "category": "Rent",
      //         "amount": 50,
      //         "date": "2025-05-05T00:00:00.000Z",
      //         "note": "",
      //         "createdAt": "2025-05-05T15:37:35.373Z",
      //         "updatedAt": "2025-05-05T15:37:35.373Z",
      //         "__v": 0
      //     }
      // ]
      let category = action.payload.transactions.map((transaction) => transaction.category)
        // console.log("action inside getTransactions", action.payload);
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.categories = category;
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get transaction by ID
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.error = null;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = [action.payload, ...state.transactions];
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        );
        state.currentTransaction = null;
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          transaction => transaction._id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get categories
      .addCase(getTransactionsCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionsCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getTransactionsCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearError } = transactionSlice.actions;
export default transactionSlice.reducer; 