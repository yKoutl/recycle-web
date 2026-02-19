
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';

export const partnerRequestsApi = createApi({
    reducerPath: 'partnerRequestsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URLS.BASE + '/partner-requests', // /api/partner-requests
    }),
    tagTypes: ['PartnerRequests'],

    endpoints: (builder) => ({

        // 1. GET ALL
        getPartnerRequests: builder.query({
            query: () => '/',
            providesTags: ['PartnerRequests'],
        }),

        // 2. CREATE (Public)
        createPartnerRequest: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['PartnerRequests'],
        }),

        // 3. UPDATE STATUS (Approve/Reject)
        updatePartnerRequestStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: ['PartnerRequests'],
        }),

        // 4. DELETE
        deletePartnerRequest: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['PartnerRequests'],
        })
    })
});

export const {
    useGetPartnerRequestsQuery,
    useCreatePartnerRequestMutation,
    useUpdatePartnerRequestStatusMutation,
    useDeletePartnerRequestMutation
} = partnerRequestsApi;
