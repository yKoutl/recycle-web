import { configureStore } from "@reduxjs/toolkit";
import { partnersSlice } from "./partners";
import { rewardsSlice, rewardsApi } from "./rewards";
import { programSlice } from "./programs";

export const store = configureStore({
    reducer: {
        // auth: authSlice.reducer,
        // levels: levelsSlice.reducer,
        partners: partnersSlice.reducer,
        // induction: inductionSlice.reducer,
        programs: programSlice.reducer,
        rewards: rewardsSlice.reducer,
        [rewardsApi.reducerPath]: rewardsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rewardsApi.middleware),
});