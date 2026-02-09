import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { vacationsReducer } from "./vacationsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vacations: vacationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
