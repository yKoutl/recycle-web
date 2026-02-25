import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';

export const programsApi = createApi({
    reducerPath: 'programsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URLS.BASE,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Programs'], // Etiqueta para el caché

    endpoints: (builder) => ({

        // 1. GET (Obtener lista)
        getPrograms: builder.query({
            query: () => '/programs',
            providesTags: ['Programs'], // Dice: "Aquí están los datos de 'Programs'"
            keepUnusedDataFor: 300, // 5 minutos de caché
        }),

        // 2. POST (Crear)
        createProgram: builder.mutation({
            query: (newProgram) => ({
                url: '/programs',
                method: 'POST',
                body: newProgram
            }),
            invalidatesTags: ['Programs'], // Dice: "Cambié algo, vuelve a pedir la lista"
        }),

        // 3. PATCH (Actualizar)
        updateProgram: builder.mutation({
            query: ({ id, ...patchData }) => ({
                url: `/programs/${id}`, // Asume que tu backend recibe el ID en la URL
                method: 'PATCH',
                body: patchData
            }),
            invalidatesTags: ['Programs'],
        }),

        // 4. GET BY ID
        getProgramById: builder.query({
            query: (id) => `/programs/${id}`,
            providesTags: ['Programs'],
        }),

        // 5. DELETE (Eliminar)
        deleteProgram: builder.mutation({
            query: (id) => ({
                url: `/programs/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Programs'],
        }),
    })
});

// Exportamos los hooks generados automáticamente
export const {
    useGetProgramsQuery,
    useGetProgramByIdQuery,
    useCreateProgramMutation,
    useUpdateProgramMutation,
    useDeleteProgramMutation
} = programsApi;