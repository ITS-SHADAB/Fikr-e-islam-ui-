import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, checkAuthStatus as checkAuthStatusApi } from '@/services';

// Check if token exists in local storage
const token = localStorage.getItem('adminToken');
const adminInfo = localStorage.getItem('adminInfo')
  ? JSON.parse(localStorage.getItem('adminInfo') || '{}')
  : null;

// Normalize user object from localStorage
const user = adminInfo?.data?.data || adminInfo?.data || adminInfo;

const initialState = {
  loggedInUser: user,
  token: token,
  userRole: user?.role || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (formData, thunkAPI) => {
    try {
      const data = await registerUser(formData);

      // Save details to local storage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const data = await loginUser({ username, password });

      // Save details to local storage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    try {
      const data = await checkAuthStatusApi();
      return data;
    } catch (error) {
      // Token is expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      return thunkAPI.rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      state.loggedInUser = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.data || action.payload?.data || action.payload;
        state.loggedInUser = user;
        state.token = action.payload?.token;
        state.userRole = user?.role || 'user';
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.data || action.payload?.data || action.payload;
        state.loggedInUser = user;
        state.token = action.payload?.token;
        state.userRole = user?.role || 'user';
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        const user = action.payload?.data || action.payload;
        state.loggedInUser = { ...state.loggedInUser, ...user };
        state.userRole = user?.role || state.userRole || 'user';
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loggedInUser = null;
        state.token = null;
        state.userRole = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

