// src/store/api/transactionsApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { api, BASE_URL } from './axiosConfig';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params }, { getState }) => {
    try {
      const token = getState().auth.token;
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const result = await api({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      console.error('axiosBaseQuery caught an error:', axiosError);
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Transaction', 'Balance', 'Category', 'Summary', 'Currency'],
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: () => ({ url: 'users/current', method: 'GET' }),
      providesTags: ['Balance'],
    }),
    getTransactionCategories: builder.query({
      query: () => ({ url: 'transaction-categories', method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCurrencyRates: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, _baseQuery) {
        const LS_RATES_KEY = 'monoCurrencyRates';
        const LS_TIMESTAMP_KEY = 'monoCurrencyLastFetch';
        const ONE_HOUR_MS = 3600 * 1000;

        try {
          const cachedTimestamp = localStorage.getItem(LS_TIMESTAMP_KEY);
          const cachedRates = localStorage.getItem(LS_RATES_KEY);

          if (cachedTimestamp && cachedRates) {
            const lastFetchTime = JSON.parse(cachedTimestamp);
            const timeDiff = Date.now() - lastFetchTime;

            if (timeDiff < ONE_HOUR_MS) {
              return { data: JSON.parse(cachedRates) };
            }
          }

          const result = await _baseQuery(
            {
              url: import.meta.env.VITE_CURRENCY_API_URL,
              method: 'GET',
            },
            _queryApi,
            _extraOptions,
          );

          if (result.error) {
            return { error: result.error };
          }

          localStorage.setItem(LS_RATES_KEY, JSON.stringify(result.data));
          localStorage.setItem(LS_TIMESTAMP_KEY, JSON.stringify(Date.now()));

          return { data: result.data };
        } catch (error) {
          console.error('getCurrencyRates queryFn hatası:', error);
          return { error: { status: 'CUSTOM_ERROR', data: error.message } };
        }
      },
      providesTags: ['Currency'],
    }),

    getTransactionsSummary: builder.query({
      query: ({ month, year }) => ({
        url: `transactions-summary?month=${month}&year=${year}`,
        method: 'GET',
      }),
      providesTags: ['Summary'],
    }),
    getTransactions: builder.query({
      query: () => ({ url: 'transactions', method: 'GET' }),
      providesTags: (result) =>
        result
          ? [/*...*/ { type: 'Transaction', id: 'LIST' }]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),
    addTransaction: builder.mutation({
      query: (newTransaction) => ({
        url: 'transactions',
        method: 'POST',
        data: newTransaction,
      }),
      invalidatesTags: [
        { type: 'Transaction', id: 'LIST' },
        'Balance',
        'Summary',
      ],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `transactions/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        'Balance',
        { type: 'Transaction', id: 'LIST' },
        'Summary',
      ],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({ url: `transactions/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Transaction', id },
        'Balance',
        { type: 'Transaction', id: 'LIST' },
        'Summary',
      ],
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useGetTransactionCategoriesQuery,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsSummaryQuery,
  useGetCurrencyRatesQuery,
} = transactionsApi;