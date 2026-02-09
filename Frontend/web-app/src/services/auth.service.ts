import api from "./api";
import type { RegisterData, LoginData } from "../models/user.model";

class AuthService {

    async register(data: RegisterData): Promise<string> {
        const response = await api.post("/api/auth/register", data);
        return response.data.data.token;
    }

    async login(data: LoginData): Promise<string> {
        const response = await api.post("/api/auth/login", data);
        return response.data.data.token;
    }
}

export const authService = new AuthService();
