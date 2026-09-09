import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  checkAuthStatus as checkAuthStatusApi,
} from "@/services";

// Helper to safely parse cached user from local storage
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("adminInfo");
    if (!raw || raw === "undefined" || raw === "null") return null;
    const parsed = JSON.parse(raw);
    const user = parsed?.data?.data || parsed?.data || parsed?.user || (parsed?._id ? parsed : null);
    return user || null;
  } catch {
    return null;
  }
};

// Helper to safely get stored token (only if genuine and non-empty)
const getStoredToken = () => {
  const t = localStorage.getItem("adminToken");
  if (!t || t === "undefined" || t === "null") {
    localStorage.removeItem("adminToken");
    return null;
  }
  return t;
};

const initialUser = getStoredUser();
const initialToken = getStoredToken();

const initialState = {
  loggedInUser: initialUser,
  token: initialToken,
  userRole: initialUser?.role || null,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const data = await registerUser(formData);
      const user = data?.data?.data || data?.data || data?.user;

      if (user) {
        localStorage.setItem("adminInfo", JSON.stringify(user));
      }
      if (data?.token && data.token !== "undefined" && data.token !== "null") {
        localStorage.setItem("adminToken", data.token);
      } else {
        localStorage.removeItem("adminToken");
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const data = await loginUser({ username, password });
      const user = data?.data?.data || data?.data || data?.user;

      if (user) {
        localStorage.setItem("adminInfo", JSON.stringify(user));
      }
      if (data?.token && data.token !== "undefined" && data.token !== "null") {
        localStorage.setItem("adminToken", data.token);
      } else {
        localStorage.removeItem("adminToken");
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, thunkAPI) => {
    try {
      const data = await checkAuthStatusApi();
      return data;
    } catch (error) {
      // Session is expired or invalid
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      try {
        sessionStorage.removeItem("google_auth_pending");
      } catch (err) {
        // ignore storage errors
      }
      state.loggedInUser = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      const user =
        action.payload?.data?.data ||
        action.payload?.data ||
        action.payload?.user ||
        action.payload;
      if (user) {
        state.loggedInUser = { ...state.loggedInUser, ...user };
        state.userRole = user.role || state.loggedInUser?.role || "user";
        try {
          localStorage.setItem("adminInfo", JSON.stringify(state.loggedInUser));
        } catch {}
      }
    },
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
        const user =
          action.payload?.data?.data ||
          action.payload?.data ||
          action.payload?.user ||
          action.payload;
        state.loggedInUser = user;
        state.token =
          action.payload?.token && action.payload.token !== "undefined"
            ? action.payload.token
            : null;
        state.userRole = user?.role || "user";
        state.isAuthenticated = !!user;
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
        const user =
          action.payload?.data?.data ||
          action.payload?.data ||
          action.payload?.user ||
          action.payload;
        state.loggedInUser = user;
        state.token =
          action.payload?.token && action.payload.token !== "undefined"
            ? action.payload.token
            : null;
        state.userRole = user?.role || "user";
        state.isAuthenticated = !!user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        const user =
          action.payload?.data?.data ||
          action.payload?.data ||
          action.payload?.user ||
          action.payload;
        state.loggedInUser = user;
        state.userRole = user?.role || "user";
        state.isAuthenticated = !!user;
        state.error = null;

        if (user) {
          localStorage.setItem("adminInfo", JSON.stringify(user));
        }

        if (action.payload?.token && action.payload.token !== "undefined") {
          state.token = action.payload.token;
          localStorage.setItem("adminToken", action.payload.token);
        } else {
          state.token = null;
          localStorage.removeItem("adminToken");
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.loggedInUser = null;
        state.token = null;
        state.userRole = null;
        state.isAuthenticated = false;
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        try {
          sessionStorage.removeItem("google_auth_pending");
        } catch (err) {
          // ignore storage errors
        }
      });
  },
});

export const { logout, clearAuthError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
