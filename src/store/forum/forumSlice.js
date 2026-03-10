import { createSlice } from "@reduxjs/toolkit";

export const forumSlice = createSlice({
    name: 'forum',
    initialState: {
        activePost: null, // El post que estás viendo en detalle o editando
        isCreateModalOpen: false, // Controlar si el modal de "Nuevo Post" está abierto
    },
    reducers: {
        onSetActivePost: (state, { payload }) => {
            state.activePost = payload;
        },
        onClearActivePost: (state) => {
            state.activePost = null;
        },
        onOpenCreateModal: (state) => {
            state.isCreateModalOpen = true;
        },
        onCloseCreateModal: (state) => {
            state.isCreateModalOpen = false;
        }
    }
});

export const {
    onSetActivePost,
    onClearActivePost,
    onOpenCreateModal,
    onCloseCreateModal
} = forumSlice.actions;

export default forumSlice.reducer;