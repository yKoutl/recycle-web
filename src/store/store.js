import { configureStore } from "@reduxjs/toolkit";
import { rewardsSlice, rewardsApi } from "./rewards";
import { programSlice, programsApi } from "./programs";
import { partnersSlice, partnersApi } from "./partners";

export const store = configureStore({
    reducer: {

        // auth: authReducer,
        rewards: rewardsSlice.reducer,
        programs: programSlice.reducer,
        partners: partnersSlice.reducer,

        [rewardsApi.reducerPath]: rewardsApi.reducer,
        [programsApi.reducerPath]: programsApi.reducer,
        [partnersApi.reducerPath]: partnersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(rewardsApi.middleware)
        .concat(programsApi.middleware)
        .concat(partnersApi.middleware),
});