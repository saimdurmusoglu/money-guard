// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from './api/axiosConfig';

const authData = JSON.parse(localStorage.getItem('authData'));

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/sign-up', {
        username: name,
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed.';
      
      return rejectWithValue(message);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/sign-in', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('authData', JSON.stringify({ user, token }));
      
      return { user, token };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid email or password.';
      
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: authData ? authData.user : null,
    token: authData ? authData.token : null,
    isAuthenticated: !!authData,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authData');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      toast.info('You have been logged out securely!');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;