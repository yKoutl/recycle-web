import { createSlice } from '@reduxjs/toolkit';

export const rewardsSlice = createSlice({
    name: 'rewards',
    initialState: {
        activeReward: null, // Solo UI local
    },
    reducers: {
        onSetActiveReward: (state, { payload }) => {
            state.activeReward = payload;
        },
        onClearActiveReward: (state) => {
            state.activeReward = null;
        }
    }
});

export const { onSetActiveReward, onClearActiveReward } = rewardsSlice.actions;
export default rewardsSlice.reducer;