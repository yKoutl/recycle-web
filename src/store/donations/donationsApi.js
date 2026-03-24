import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const donationsApi = createApi({
    reducerPath: 'donationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://nosplanet-back-prueba-production.up.railway.app/api',
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
        rejectDonation: builder.mutation({
            query: (id) => ({
                url: `/donations/${id}/reject`,
                method: 'PATCH',
            }),
        }),
        deleteDonation: builder.mutation({
            query: (id) => ({
                url: `/donations/${id}`,
                method: 'DELETE',
            }),
        }),
        toggleMembership: builder.mutation({
            query: (userId) => ({
                url: `/donations/user/${userId}/toggle-membership`,
                method: 'PATCH',
            }),
        }),
        sendThankYouEmail: builder.mutation({
            query: (id) => ({
                url: `/donations/${id}/send-email`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useCreateDonationMutation,
    useGetDonationsQuery,
    useApproveDonationMutation,
    useRejectDonationMutation,
    useDeleteDonationMutation,
    useToggleMembershipMutation,
    useSendThankYouEmailMutation
} = donationsApi;
