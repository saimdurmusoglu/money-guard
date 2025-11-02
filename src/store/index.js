// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { transactionsApi } from './api/transactionsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionsApi.middleware),
});