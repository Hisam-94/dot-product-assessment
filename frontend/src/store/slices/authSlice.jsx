import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear auth token from headers
      if (axios.defaults.headers.common["x-auth-token"]) {
        delete axios.defaults.headers.common["x-auth-token"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthToken: (state, action) => {
      const token = action.payload;
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
      } else {
        delete axios.defaults.headers.common["x-auth-token"];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Async thunks for auth operations
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // console.log('Loading user with token in state:', state.token);
      const res = await axios.get(`${url}/api/auth/profile`);
      return res.data;
    } catch (err) {
      localStorage.removeItem('token');
      dispatch(setAuthToken(null));
      return rejectWithValue(err.response?.data?.message || 'Session expired. Please login again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/api/auth/register`, userData);
      localStorage.setItem("token", res.data.token);
      dispatch(setAuthToken(res.data.token));
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/api/auth/login`, userData);
      localStorage.setItem("token", res.data.token);
      dispatch(setAuthToken(res.data.token));
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }
);

// Initialize token in headers if it exists
if (initialState.token) {
  axios.defaults.headers.common["x-auth-token"] = initialState.token;
}

// Export actions and reducer
export const { logout, clearError, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
