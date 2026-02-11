import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking' | 'authenticated' | 'not-authenticated'
        user: null,         // Aquí guardaremos los datos del usuario logueado (id, email, role, etc.)
        token: null,        // El JWT
        errorMessage: undefined,
    },
    reducers: {
        onChecking: (state) => {
            state.status = 'checking';
            state.user = null;
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }) => {
            state.status = 'authenticated';
            state.user = payload.user; // Asume que el backend devuelve { user, token }
            state.token = payload.token;
            state.errorMessage = undefined;
            // Opcional: Guardar en localStorage aquí o mediante middleware
            localStorage.setItem('token', payload.token);
        },
        onLogout: (state, { payload }) => {
            state.status = 'not-authenticated';
            state.user = null;
            state.token = null;
            state.errorMessage = payload;
            localStorage.removeItem('token');
        },
        onClearError: (state) => {
            state.errorMessage = undefined;
        },
        // Acción especial para actualizar datos del usuario sin reloguear (ej: cambiar foto)
        onUpdateUser: (state, { payload }) => {
            state.user = { ...state.user, ...payload };
        }
    }
});

export const { onChecking, onLogin, onLogout, onClearError, onUpdateUser } = authSlice.actions;

export default authSlice.reducer;