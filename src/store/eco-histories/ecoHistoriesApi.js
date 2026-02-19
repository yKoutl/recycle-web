import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ecoHistoriesApi = createApi({
    reducerPath: 'ecoHistoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['EcoHistories'],
    endpoints: (builder) => ({
        // Público
        getApprovedHistories: builder.query({
            query: () => '/eco-histories/public',
            providesTags: ['EcoHistories'],
        }),
        getFeaturedHistories: builder.query({
            query: () => '/eco-histories/featured',
            providesTags: ['EcoHistories'],
        }),
        // Admin
        getAllHistories: builder.query({
            query: () => '/eco-histories/admin',
            providesTags: ['EcoHistories'],
        }),
        createHistory: builder.mutation({
            query: (newHistory) => ({
                url: '/eco-histories',
                method: 'POST',
                body: newHistory,
            }),
            invalidatesTags: ['EcoHistories'],
        }),
        updateHistoryStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/eco-histories/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['EcoHistories'],
        }),
        toggleFeaturedHistory: builder.mutation({
            query: (id) => ({
                url: `/eco-histories/${id}/featured`,
                method: 'PATCH',
            }),
            invalidatesTags: ['EcoHistories'],
        }),
        likeHistory: builder.mutation({
            query: (id) => ({
                url: `/eco-histories/${id}/like`,
                method: 'PATCH',
            }),
            invalidatesTags: ['EcoHistories'],
        }),
        deleteHistory: builder.mutation({
            query: (id) => ({
                url: `/eco-histories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EcoHistories'],
        }),
    }),
});

export const {
    useGetApprovedHistoriesQuery,
    useGetFeaturedHistoriesQuery,
    useGetAllHistoriesQuery,
    useCreateHistoryMutation,
    useUpdateHistoryStatusMutation,
    useToggleFeaturedHistoryMutation,
    useLikeHistoryMutation,
    useDeleteHistoryMutation,
} = ecoHistoriesApi;
