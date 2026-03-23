import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';

export const redemptionApi = createApi({
    reducerPath: 'redemptions',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URLS.BASE}`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Redemption'],
    endpoints: (builder) => ({
        // 1. Obtener historial (Tabla)
        getRedemptions: builder.query({
            query: () => '/redemptions',
            providesTags: ['Redemption'],
        }),

        // 2. BUSCAR (GET) - Para el flujo de confirmación en el Modal
        // Este no invalida etiquetas porque solo está "mirando"
        searchRedemption: builder.query({
            query: (code) => `/redemptions/search/${code}`,
            // No usamos providesTags aquí para evitar que el cache 
            // muestre datos viejos si el código se vuelve a generar
        }),

        // 3. VALIDAR (PATCH) - Acción final de entrega
        validateCode: builder.mutation({
            query: (code) => ({
                url: `/redemptions/validate/${code}`,
                method: 'PATCH',
            }),
            // 🚨 Al terminar con éxito, obliga a la tabla a refrescarse sola
            invalidatesTags: ['Redemption'],
        }),

        // 4. CREAR (POST) - Para la App Móvil
        createRedemption: builder.mutation({
            query: (payload) => ({
                url: '/redemptions',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Redemption'],
        })
    }),
});

// 💡 EXPORTACIÓN CLAVE:
export const {
    useGetRedemptionsQuery,
    useLazySearchRedemptionQuery, // 👈 IMPORTANTE: Se usa para disparar la búsqueda manualmente
    useValidateCodeMutation,
    useCreateRedemptionMutation
} = redemptionApi;