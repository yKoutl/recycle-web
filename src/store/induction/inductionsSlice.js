import { createSlice } from '@reduxjs/toolkit';

export const inductionSlice = createSlice({
    name: 'induction',
    initialState: {
        activeInduction: null,
    },
    reducers: {
        onSetActiveInduction: (state, { payload }) => {
            state.activeInduction = payload;
        },
        onClearActiveInduction: (state) => {
            state.activeInduction = null;
        }
    }
});

export const { onSetActiveInduction, onClearActiveInduction } = inductionSlice.actions;

export default inductionSlice.reducer;