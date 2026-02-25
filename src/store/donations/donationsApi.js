import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const donationsApi = createApi({
    reducerPath: 'donationsApi',
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
    endpoints: (builder) => ({
        createDonation: builder.mutation({
            query: (donation) => ({
                url: '/donations',
                method: 'POST',
                body: donation,
            }),
        }),
        getDonations: builder.query({
            query: () => '/donations',
        }),
        approveDonation: builder.mutation({
            query: (id) => ({
                url: `/donations/${id}/approve`,
                method: 'PATCH',
            }),
        }),
    }),
});

export const { useCreateDonationMutation, useGetDonationsQuery, useApproveDonationMutation } = donationsApi;
