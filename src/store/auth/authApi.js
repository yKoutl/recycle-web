import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/auth' }),

    endpoints: (builder) => ({

        // 1. LOGIN (@Post('login'))
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials, // { email, password }
            }),
        }),

        // 2. REGISTER (@Post('register'))
        register: builder.mutation({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // 3. CHECK STATUS (@Get('check-status'))
        checkStatus: builder.query({
            query: () => ({
                url: '/check-status',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
        }),

        // 4. FORGOT PASSWORD (@Post('forgot-password'))
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email }, // Tu controller espera { email: string }
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useCheckStatusQuery,
    useForgotPasswordMutation
} = authApi;