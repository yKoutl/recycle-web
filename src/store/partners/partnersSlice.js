import { createSlice } from '@reduxjs/toolkit';

export const partnersSlice = createSlice({
    name: 'partners',
    initialState: {
        activePartner: null, // Solo para saber cuál estamos editando/viendo en el modal
    },
    reducers: {
        onSetActivePartner: (state, action) => {
            state.activePartner = action.payload;
        },
        onClearActivePartner: (state) => {
            state.activePartner = null;
        }
    }
});

export const { onSetActivePartner, onClearActivePartner } = partnersSlice.actions;

export default partnersSlice.reducer;