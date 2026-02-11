import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';

export const rewardsApi = createApi({
    reducerPath: 'rewardsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URLS.BASE,
    }),
    tagTypes: ['Rewards'], // Etiqueta para el caché

    endpoints: (builder) => ({

        // 1. GET (Soporta filtro por categoría como en tu Controller)
        getRewards: builder.query({
            query: (category) => {
                // Si envías categoría, arma la URL con query param
                if (category) {
                    return `/rewards?category=${category}`;
                }
                // Si no, trae todos
                return '/rewards';
            },
            providesTags: ['Rewards'],
            keepUnusedDataFor: 300, // 5 minutos de caché
        }),

        // 2. POST (Crear)
        createReward: builder.mutation({
            query: (newReward) => ({
                url: '/rewards',
                method: 'POST',
                body: newReward
            }),
            invalidatesTags: ['Rewards'], // Obliga a refrescar la lista
        }),

        // 3. PATCH (Actualizar - Tu back usa @Patch)
        updateReward: builder.mutation({
            query: ({ id, ...patchData }) => ({
                url: `/rewards/${id}`,
                method: 'PATCH',
                body: patchData
            }),
            invalidatesTags: ['Rewards'],
        }),

        // 4. DELETE (Borrar)
        deleteReward: builder.mutation({
            query: (id) => ({
                url: `/rewards/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Rewards'],
        }),
    })
});

export const {
    useGetRewardsQuery,
    useCreateRewardMutation,
    useUpdateRewardMutation,
    useDeleteRewardMutation
} = rewardsApi;