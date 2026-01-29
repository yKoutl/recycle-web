import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const partnersApi = createApi({
    reducerPath: 'partnersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api', // Asegúrate de que este sea tu puerto correcto
    }),
    tagTypes: ['Partners'], // Etiqueta para el caché

    endpoints: (builder) => ({

        // 1. GET ALL (@Get() findAll)
        getPartners: builder.query({
            query: () => '/partners',
            providesTags: ['Partners'],
            keepUnusedDataFor: 300, // 5 minutos en caché
        }),

        // 2. GET ONE (@Get(':id') findOne) - Opcional, por si lo necesitas luego
        getPartnerById: builder.query({
            query: (id) => `/partners/${id}`,
            providesTags: (result, error, id) => [{ type: 'Partners', id }],
        }),

        // 3. CREATE (@Post() create)
        createPartner: builder.mutation({
            query: (newPartner) => ({
                url: '/partners',
                method: 'POST',
                body: newPartner
            }),
            invalidatesTags: ['Partners'], // Refresca la lista automáticamente
        }),

        // 4. UPDATE (@Patch(':id') update)
        updatePartner: builder.mutation({
            query: ({ id, ...patchData }) => ({
                url: `/partners/${id}`,
                method: 'PATCH', // IMPORTANTE: Tu controller usa @Patch
                body: patchData
            }),
            invalidatesTags: ['Partners'],
        }),

        // 5. DELETE (@Delete(':id') remove)
        deletePartner: builder.mutation({
            query: (id) => ({
                url: `/partners/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Partners'],
        }),
    })
});

// Exportamos los hooks
export const {
    useGetPartnersQuery,
    useGetPartnerByIdQuery,
    useCreatePartnerMutation,
    useUpdatePartnerMutation,
    useDeletePartnerMutation
} = partnersApi;