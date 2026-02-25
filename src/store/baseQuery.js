import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQueryWithAuth = (baseUrl) => fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        // Obtenemos el token del estado de Redux
        const token = getState().auth.token || localStorage.getItem('token');

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    },
});
