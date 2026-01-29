import { createSlice } from "@reduxjs/toolkit";

export const programSlice = createSlice({
    name: 'programs',
    initialState: {
        activeProgram: null, // Solo guardamos esto para saber cuál se está editando/viendo
    },
    reducers: {
        onSetActiveProgram: (state, { payload }) => {
            state.activeProgram = payload;
        },
        onClearActiveProgram: (state) => {
            state.activeProgram = null;
        }
    }
});

export const {
    onSetActiveProgram,
    onClearActiveProgram
} = programSlice.actions;

export default programSlice.reducer;