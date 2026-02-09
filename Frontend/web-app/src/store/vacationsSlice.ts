import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VacationModel } from "../models/vacation.model";
import { logout } from "./authSlice";

interface VacationsState {
    list: VacationModel[];
    loading: boolean;
}

const initialState: VacationsState = {
    list: [],
    loading: false,
};

const vacationsSlice = createSlice({
    name: "vacations",
    initialState,
    reducers: {
        setVacations(state, action: PayloadAction<VacationModel[]>) {
            state.list = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        addVacation(state, action: PayloadAction<VacationModel>) {
            state.list.push(action.payload);
        },
        updateVacation(state, action: PayloadAction<VacationModel>) {
            const index = state.list.findIndex(vacation => vacation.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        deleteVacation(state, action: PayloadAction<number>) {
            state.list = state.list.filter(vacation => vacation.id !== action.payload);
        },
        toggleLike(state, action: PayloadAction<{ vacationId: number; isLiked: boolean }>) {
            const vacation = state.list.find(item => item.id === action.payload.vacationId);
            if (vacation) {
                vacation.isLikedByUser = action.payload.isLiked;
                vacation.likesCount += action.payload.isLiked ? 1 : -1;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.list = [];
            state.loading = false;
        });
    },
});

export const { setVacations, setLoading, addVacation, updateVacation, deleteVacation, toggleLike } = vacationsSlice.actions;
export const vacationsReducer = vacationsSlice.reducer;
