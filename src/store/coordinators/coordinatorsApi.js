import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';

export const coordinatorsApi = createApi({
    reducerPath: 'coordinatorsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URLS.BASE}/coordinators`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authentication', `Bearer ${token}`);
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Coordinators'],

    endpoints: (builder) => ({
        getCoordinators: builder.query({
            query: (managerId) => managerId ? `?managerId=${managerId}` : '/',
            providesTags: ['Coordinators'],
            keepUnusedDataFor: 60,
        }),
        createCoordinator: builder.mutation({
            query: (newCoordinator) => ({
                url: '/',
                method: 'POST',
                body: newCoordinator,
            }),
            invalidatesTags: ['Coordinators'],
        }),
        updateCoordinator: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['Coordinators'],
        }),
        deleteCoordinator: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coordinators'],
        }),
    }),
});

export const {
    useGetCoordinatorsQuery,
    useCreateCoordinatorMutation,
    useUpdateCoordinatorMutation,
    useDeleteCoordinatorMutation
} = coordinatorsApi;
