import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initial state
const initialState = {
  financialSummary: null,
  yearlyOverview: null,
  loading: false,
  error: null
};

// Async thunks for summary operations
export const getFinancialSummary = createAsyncThunk(
  'summary/getFinancialSummary',
  async (month, { rejectWithValue }) => {
    try {
      const queryParams = month ? `?month=${month}` : '';
      const response = await axios.get(`${url}/api/summary${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch financial summary');
    }
  }
);

export const getYearlyOverview = createAsyncThunk(
  'summary/getYearlyOverview',
  async (year, { rejectWithValue }) => {
    try {
      const queryParams = year ? `?year=${year}` : '';
      const response = await axios.get(`${url}/api/summary/monthly${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch yearly overview');
    }
  }
);

// Summary slice
const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get financial summary
      .addCase(getFinancialSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFinancialSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.financialSummary = action.payload;
        state.error = null;
      })
      .addCase(getFinancialSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get yearly overview
      .addCase(getYearlyOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getYearlyOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.yearlyOverview = action.payload;
        state.error = null;
      })
      .addCase(getYearlyOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = summarySlice.actions;
export default summarySlice.reducer; 