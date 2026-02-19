import { configureStore } from "@reduxjs/toolkit";
import { rewardsSlice, rewardsApi } from "./rewards";
import { programSlice, programsApi } from "./programs";
import { partnersSlice, partnersApi } from "./partners";
import { partnerRequestsApi } from "./partners/partnerRequestsApi";
import { authSlice, authApi } from "./auth";
import { usersSlice, usersApi } from "./user";
import { ecoHistoriesApi } from "./eco-histories/ecoHistoriesApi";

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
        [partnerRequestsApi.reducerPath]: partnerRequestsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [ecoHistoriesApi.reducerPath]: ecoHistoriesApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(rewardsApi.middleware)
        .concat(programsApi.middleware)
        .concat(partnersApi.middleware)
        .concat(partnerRequestsApi.middleware)
        .concat(authApi.middleware)
        .concat(usersApi.middleware)
        .concat(ecoHistoriesApi.middleware),
});