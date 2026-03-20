import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';
import { baseQueryWithAuth } from '../baseQuery';

export const inductionApi = createApi({
    reducerPath: 'inductionApi',
    baseQuery: baseQueryWithAuth(API_URLS.BASE),
    tagTypes: ['induction'],

    endpoints: (builder) => ({

        // 1. Obtener todas (Cambiado de 'getinduction' a 'getInductions')
        getInductions: builder.query({
            query: () => '/induction',
            providesTags: ['induction'],
            keepUnusedDataFor: 300,
        }),

        // 2. Obtener una por ID
        getInductionById: builder.query({
            query: (id) => `/induction/${id}`,
            providesTags: (result, error, id) => [{ type: 'induction', id }],
        }),

        // 3. Crear
        createInduction: builder.mutation({
            query: (newInduction) => ({
                url: '/induction',
                method: 'POST',
                body: newInduction
            }),
            invalidatesTags: ['induction'],
        }),

        // 4. Actualizar
        updateInduction: builder.mutation({
            query: ({ id, ...patchData }) => ({
                url: `/induction/${id}`,
                method: 'PATCH',
                body: patchData
            }),
            invalidatesTags: (result, error, { id }) => ['induction', { type: 'induction', id }],
        }),

        // 5. Eliminar
        deleteInduction: builder.mutation({
            query: (id) => ({
                url: `/induction/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['induction'],
        }),
    })
});

// Ahora estos nombres coinciden perfectamente con los endpoints definidos arriba
export const {
    useGetInductionsQuery,
    useGetInductionByIdQuery,
    useCreateInductionMutation,
    useUpdateInductionMutation,
    useDeleteInductionMutation
} = inductionApi;