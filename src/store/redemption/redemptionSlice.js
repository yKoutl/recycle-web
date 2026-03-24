import { createSlice } from '@reduxjs/toolkit';

export const redemptionSlice = createSlice({
    name: 'redemption',
    initialState: {
        activeRedemption: null, // El canje que se acaba de encontrar con el buscador
        searchQuery: '',        // El texto del buscador de códigos
        isSidebarOpen: false,
        isScannerOpen: false,    // Si el modal de la cámara está abierto
    },
    reducers: {
        onSetActiveRedemption: (state, { payload }) => {
            state.activeRedemption = payload;
            state.isSidebarOpen = true; // 👈 Se abre automáticamente al encontrar un canje
        },
        onSetSearchQuery: (state, { payload }) => {
            state.searchQuery = payload;
        },
        onCloseSidebar: (state) => {
            state.isSidebarOpen = false;
            // Opcional: limpiar activeRedemption después de que termine la animación
        },
        onToggleScanner: (state) => {
            state.isScannerOpen = !state.isScannerOpen;
        },
        onClearRedemption: (state) => {
            state.activeRedemption = null;
            state.searchQuery = '';
        }
    },
});

export const {
    onSetActiveRedemption,
    onSetSearchQuery,
    onToggleScanner,
    onClearRedemption
} = redemptionSlice.actions;