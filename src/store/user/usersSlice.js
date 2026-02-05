import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        activeUser: null, // Aquí guardamos el usuario seleccionado para ver detalle/editar
    },
    reducers: {
        onSetActiveUser: (state, action) => {
            state.activeUser = action.payload;
        },
        onClearActiveUser: (state) => {
            state.activeUser = null;
        }
    }
});

export const { onSetActiveUser, onClearActiveUser } = usersSlice.actions;

export default usersSlice.reducer;