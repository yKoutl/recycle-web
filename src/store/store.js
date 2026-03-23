import { configureStore } from "@reduxjs/toolkit";
import { rewardsSlice, rewardsApi } from "./rewards";
import { programSlice, programsApi } from "./programs";
import { partnersSlice, partnersApi } from "./partners";
import { partnerRequestsApi } from "./partners/partnerRequestsApi";
import { authSlice, authApi } from "./auth";
import { usersSlice, usersApi } from "./user";
import { ecoHistoriesApi } from "./eco-histories/ecoHistoriesApi";
import { donationsApi } from "./donations/donationsApi";
import { contactApi } from "./contact/contactApi";
import { inductionApi, inductionSlice } from "./induction";
import { redemptionApi, redemptionSlice } from "./redemption";

import { forumSlice, forumApi } from "./forum";
import { coordinatorsApi } from "./coordinators/coordinatorsApi";

export const store = configureStore({
        // 1. El objeto reducer contiene todos tus slices y APIs
        reducer: {
                // Slices (Estado local)
                rewards: rewardsSlice.reducer,
                programs: programSlice.reducer,
                partners: partnersSlice.reducer,
                auth: authSlice.reducer,
                users: usersSlice.reducer,
                forum: forumSlice.reducer,
                induction: inductionSlice.reducer,
                redemption: redemptionSlice.reducer,

                // APIs (RTK Query)
                [rewardsApi.reducerPath]: rewardsApi.reducer,
                [programsApi.reducerPath]: programsApi.reducer,
                [partnersApi.reducerPath]: partnersApi.reducer,
                [partnerRequestsApi.reducerPath]: partnerRequestsApi.reducer,
                [authApi.reducerPath]: authApi.reducer,
                [usersApi.reducerPath]: usersApi.reducer,
                [ecoHistoriesApi.reducerPath]: ecoHistoriesApi.reducer,
                [donationsApi.reducerPath]: donationsApi.reducer,
                [contactApi.reducerPath]: contactApi.reducer,
                [forumApi.reducerPath]: forumApi.reducer,
                [coordinatorsApi.reducerPath]: coordinatorsApi.reducer,
                [inductionApi.reducerPath]: inductionApi.reducer,
                [redemptionApi.reducerPath]: redemptionApi.reducer,
        },
        // 2. El middleware va FUERA del objeto reducer, pero DENTRO de configureStore
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        rewardsApi.middleware,
                        programsApi.middleware,
                        partnersApi.middleware,
                        partnerRequestsApi.middleware,
                        authApi.middleware,
                        usersApi.middleware,
                        ecoHistoriesApi.middleware,
                        donationsApi.middleware,
                        contactApi.middleware,
                        forumApi.middleware,
                        inductionApi.middleware,
                        coordinatorsApi.middleware,
                        redemptionApi.middleware
                ),
});