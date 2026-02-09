import dotenv from "dotenv";
dotenv.config();

class AppConfig {
    public readonly port = Number(process.env.PORT) || 3000;
    public readonly authUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
    public readonly vacationUrl = process.env.VACATION_SERVICE_URL || "http://localhost:3002";
    public readonly frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
}

export const appConfig = new AppConfig();
