import axios from "axios";
import { appConfig } from "../utils/app-config";

// Create axios instance with base URL:
const api = axios.create({
    baseURL: appConfig.apiUrl,
});

// Request interceptor — attach JWT token to every request:
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
