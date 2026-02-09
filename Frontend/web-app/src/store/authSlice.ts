import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserPayload {
    userId: number;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
}

interface AuthState {
    token: string | null;
    user: UserPayload | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    user: null,
};

// Parse JWT payload (without library — just base64 decode):
function parseToken(token: string): UserPayload | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            userId: payload.userId,
            role: payload.role,
            firstName: payload.firstName,
            lastName: payload.lastName,
        };
    } catch {
        return null;
    }
}

// If we have a stored token, parse it:
if (initialState.token) {
    initialState.user = parseToken(initialState.token);
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<string>) {
            const token = action.payload;
            state.token = token;
            state.user = parseToken(token);
            localStorage.setItem("token", token);
        },
        logout(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
        },
    },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
