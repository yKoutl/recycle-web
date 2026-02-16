import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const forumApi = createApi({
    reducerPath: 'forumApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api', // Ajusta el puerto si es necesario
        // --- IMPORTANTE: Inyectar el Token para los Endpoints Protegidos ---
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Posts', 'MyPosts', 'Comments'], // Etiquetas para el caché

    endpoints: (builder) => ({

        // 1. OBTENER FEED (@Get() findAll)
        getPosts: builder.query({
            query: () => '/forum',
            providesTags: ['Posts'],
            keepUnusedDataFor: 60, // 1 minuto de caché para mantener el feed fresco
        }),

        // 2. CREAR POST (@Post() create)
        createPost: builder.mutation({
            query: (newPost) => ({
                url: '/forum',
                method: 'POST',
                body: newPost, // { title, content, image?, category? }
            }),
            invalidatesTags: ['Posts', 'MyPosts'], // Refresca el feed general y "mis posts"
        }),

        // 3. DAR LIKE (@Patch(':id/like') toggleLike)
        toggleLike: builder.mutation({
            query: (postId) => ({
                url: `/forum/${postId}/like`,
                method: 'PATCH',
            }),
            // Invalidamos el post específico para actualizar el contador de likes
            invalidatesTags: (result, error, id) => [{ type: 'Posts', id }, 'Posts'],
        }),

        // 4. AGREGAR COMENTARIO (@Post('comment') addComment)
        addComment: builder.mutation({
            query: ({ postId, content }) => ({
                url: '/forum/comment',
                method: 'POST',
                body: { postId, content },
            }),
            // Al comentar, invalidamos los comentarios de ese post
            invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
        }),

        // 5. VER COMENTARIOS (@Get(':id/comments') getComments)
        getCommentsByPost: builder.query({
            query: (postId) => `/forum/${postId}/comments`,
            providesTags: (result, error, postId) => [{ type: 'Comments', id: postId }],
        }),

        // 6. MIS POSTS (@Get('my-posts') findMyPosts)
        getMyPosts: builder.query({
            query: () => '/forum/my-posts',
            providesTags: ['MyPosts'],
        }),

        // 7. ELIMINAR POST (@Delete(':id') deletePost)
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/forum/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts', 'MyPosts'], // Refresca ambas listas
        }),
    })
});

// Exportamos los hooks automáticos
export const {
    useGetPostsQuery,
    useCreatePostMutation,
    useToggleLikeMutation,
    useAddCommentMutation,
    useGetCommentsByPostQuery,
    useGetMyPostsQuery,
    useDeletePostMutation
} = forumApi;