import { apiSlice } from '@/app/api/apiSlice';
import type { Scenario, CreateScenarioRequest, UpdateScenarioRequest, ApiResponse } from '@/types';

export const scenarioApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllScenarios: builder.query<ApiResponse<Scenario[]>, void>({
      query: () => '/scenario',
      providesTags: ['Scenario'],
    }),
    getScenariosByBusiness: builder.query<ApiResponse<Scenario[]>, number>({
      query: (businessId) => `/scenario/business/${businessId}`,
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Scenario' as const, id })), { type: 'Scenario', id: 'LIST' }]
          : [{ type: 'Scenario', id: 'LIST' }],
    }),
    createScenario: builder.mutation<ApiResponse<Scenario>, CreateScenarioRequest>({
      query: (scenario) => ({
        url: '/scenario',
        method: 'POST',
        body: scenario,
      }),
      invalidatesTags: [{ type: 'Scenario', id: 'LIST' }],
    }),
    updateScenario: builder.mutation<ApiResponse<Scenario>, UpdateScenarioRequest & { id: number }>({
      query: ({ id, ...scenario }) => ({
        url: `/scenario/${id}`,
        method: 'PUT',
        body: scenario,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Scenario', id }, { type: 'Scenario', id: 'LIST' }],
    }),
    deleteScenario: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/scenario/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Scenario', id }, { type: 'Scenario', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllScenariosQuery,
  useGetScenariosByBusinessQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
} = scenarioApiSlice;
