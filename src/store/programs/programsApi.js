import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const programsApi = createApi({
    reducerPath: 'programsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api', // Ajusta si tu puerto es diferente
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

        // 4. DELETE (Eliminar)
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
    useCreateProgramMutation,
    useUpdateProgramMutation,
    useDeleteProgramMutation
} = programsApi;