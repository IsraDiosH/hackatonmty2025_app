import { apiSlice } from '@/app/api/apiSlice';
import type { Transaction, CreateTransactionRequest, UpdateTransactionRequest, ApiResponse } from '@/types';

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<ApiResponse<Transaction[]>, void>({
      query: () => '/transaction',
      providesTags: ['Transaction'],
    }),
    getTransactionsByBusiness: builder.query<ApiResponse<Transaction[]>, number>({
      query: (businessId) => `/transaction/business/${businessId}`,
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Transaction' as const, id })), { type: 'Transaction', id: 'LIST' }]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),
    createTransaction: builder.mutation<ApiResponse<Transaction>, CreateTransactionRequest>({
      query: (transaction) => ({
        url: '/transaction',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
    }),
    updateTransaction: builder.mutation<ApiResponse<Transaction>, UpdateTransactionRequest & { id: number }>({
      query: ({ id, ...transaction }) => ({
        url: `/transaction/${id}`,
        method: 'PUT',
        body: transaction,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Transaction', id }, { type: 'Transaction', id: 'LIST' }],
    }),
    deleteTransaction: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Transaction', id }, { type: 'Transaction', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionsByBusinessQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApiSlice;
