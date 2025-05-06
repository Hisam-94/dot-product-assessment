import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';


// Initial state
const initialState = {
  currentBudget: null,
  budgetHistory: [],
  loading: false,
  error: null
};

// Async thunks for budget operations
export const getCurrentBudget = createAsyncThunk(
  'budget/getCurrentBudget',
  async (month, { rejectWithValue }) => {
    try {
      const queryParams = month ? `?month=${month}` : '';
      const response = await axios.get(`${url}/api/budget${queryParams}`);
      return response.data;
    } catch (error) {
      // Special case: 404 means no budget set (not actually an error)
      if (error.response && error.response.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch budget');
    }
  }
);

export const setBudget = createAsyncThunk(
  'budget/setBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/budget`, budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set budget');
    }
  }
);

export const getBudgetHistory = createAsyncThunk(
  'budget/getBudgetHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/budget/history`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch budget history');
    }
  }
);

// Budget slice
const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get current budget
      .addCase(getCurrentBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBudget = action.payload;
        state.error = null;
      })
      .addCase(getCurrentBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Set budget
      .addCase(setBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBudget = action.payload;
        
        // Also update budget history if this budget is already in the history
        // or add it if it's not
        const index = state.budgetHistory.findIndex(b => b.month === action.payload.month);
        if (index >= 0) {
          state.budgetHistory[index] = action.payload;
        } else if (state.budgetHistory.length > 0) {
          state.budgetHistory.push(action.payload);
        }
        
        state.error = null;
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get budget history
      .addCase(getBudgetHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBudgetHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetHistory = action.payload;
        state.error = null;
      })
      .addCase(getBudgetHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer; 