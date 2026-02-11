import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/users',
        // --- ESTO ES CRUCIAL PARA RUTAS PROTEGIDAS ---
        prepareHeaders: (headers, { getState }) => {
            // Intentamos sacar el token del estado de Redux primero
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authentication', `Bearer ${token}`); // O 'Authorization' según tu backend
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users'],

    endpoints: (builder) => ({

        // 1. GET ALL (@Get()) - Para el Admin
        getUsers: builder.query({
            query: () => '/',
            providesTags: ['Users'],
            keepUnusedDataFor: 60,
        }),

        // 2. DELETE USER (@Delete(':id'))
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // 3. UPDATE PROFILE (@Patch('profile'))
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: '/profile',
                method: 'PATCH',
                body: profileData,
            }),
            // Si el perfil cambia, invalidamos caché de usuario si tuviéramos un getProfile
        }),

        // 4. UPLOAD AVATAR (@Post('avatar'))
        uploadAvatar: builder.mutation({
            query: (file) => {
                // Para subir archivos necesitamos FormData
                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: '/avatar',
                    method: 'POST',
                    body: formData,
                    // fetchBaseQuery detecta FormData y quita el Content-Type para que el navegador ponga el boundary correcto
                };
            },
        }),
    }),
});

export const {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateProfileMutation,
    useUploadAvatarMutation
} = usersApi;