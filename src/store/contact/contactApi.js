import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQuery';

export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: baseQueryWithAuth('http://localhost:3000/api'),
    tagTypes: ['Contact'],
    endpoints: (builder) => ({
        submitContact: builder.mutation({
            query: (data) => ({
                url: '/contact',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Contact'],
        }),
        getContacts: builder.query({
            query: () => '/contact',
            providesTags: ['Contact'],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/contact/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Contact'],
        }),
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/contact/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Contact'],
        }),
    }),
});

export const {
    useSubmitContactMutation,
    useGetContactsQuery,
    useMarkAsReadMutation,
    useDeleteContactMutation,
} = contactApi;
