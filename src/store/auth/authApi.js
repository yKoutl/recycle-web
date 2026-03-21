import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../api/config';
import { baseQueryWithAuth } from '../baseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithAuth(API_URLS.AUTH),

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
            query: () => '/check-status',
            // Forzar refetch si el token cambia, evitando caché obsoleta
            keepUnusedDataFor: 0,
        }),

        // 4. FORGOT PASSWORD (@Post('forgot-password'))
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email }, // Tu controller espera { email: string }
            }),
        }),

        // 5. RESET PASSWORD (@Post('reset-password'))
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/reset-password',
                method: 'POST',
                body: data, // { email, code, newPassword }
            }),
        }),

        // 6. INVITE MANAGER (@Post('invite-manager'))
        inviteManager: builder.mutation({
            query: (email) => ({
                url: '/invite-manager',
                method: 'POST',
                body: { email },
            }),
        }),

        // 7. INVITE COORDINATOR (@Post('invite-coordinator'))
        inviteCoordinator: builder.mutation({
            query: (data) => ({
                url: '/invite-coordinator',
                method: 'POST',
                body: data, // { email, managerId }
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useCheckStatusQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useInviteManagerMutation,
    useInviteCoordinatorMutation
} = authApi;