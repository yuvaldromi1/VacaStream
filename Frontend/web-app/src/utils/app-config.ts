// API base URL — all requests go through the Gateway:
export const appConfig = {
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
};
