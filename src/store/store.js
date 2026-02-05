import { configureStore } from "@reduxjs/toolkit";
import { rewardsSlice, rewardsApi } from "./rewards";
import { programSlice, programsApi } from "./programs";
import { partnersSlice, partnersApi } from "./partners";
import { authSlice, authApi } from "./auth";
import { usersSlice, usersApi } from "./user";

export const store = configureStore({
    reducer: {

        // auth: authReducer,
        rewards: rewardsSlice.reducer,
        programs: programSlice.reducer,
        partners: partnersSlice.reducer,
        auth: authSlice.reducer,
        users: usersSlice.reducer,


        [rewardsApi.reducerPath]: rewardsApi.reducer,
        [programsApi.reducerPath]: programsApi.reducer,
        [partnersApi.reducerPath]: partnersApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(rewardsApi.middleware)
        .concat(programsApi.middleware)
        .concat(partnersApi.middleware)
        .concat(authApi.middleware)
        .concat(usersApi.middleware),
});