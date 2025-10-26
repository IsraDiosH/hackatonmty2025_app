import { apiSlice } from '@/app/api/apiSlice';
import type { Business, CreateBusinessRequest, UpdateBusinessRequest, ApiResponse } from '@/types';

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBusinesses: builder.query<ApiResponse<Business[]>, void>({
      query: () => '/businesses',
      providesTags: ['Business'],
    }),
    getBusinessesByUser: builder.query<ApiResponse<Business[]>, number>({
      query: (userId) => `/businesses/user/${userId}`,
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Business' as const, id })), { type: 'Business', id: 'LIST' }]
          : [{ type: 'Business', id: 'LIST' }],
    }),
    createBusiness: builder.mutation<ApiResponse<Business>, CreateBusinessRequest>({
      query: (business) => ({
        url: '/businesses',
        method: 'POST',
        body: business,
      }),
      invalidatesTags: [{ type: 'Business', id: 'LIST' }],
    }),
    updateBusiness: builder.mutation<ApiResponse<Business>, UpdateBusinessRequest & { id: number }>({
      query: ({ id, ...business }) => ({
        url: `/businesses/${id}`,
        method: 'PUT',
        body: business,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, { type: 'Business', id: 'LIST' }],
    }),
    deleteBusiness: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Business', id }, { type: 'Business', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllBusinessesQuery,
  useGetBusinessesByUserQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} = businessApiSlice;
