import dotenv from "dotenv";
dotenv.config();

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT) || 3002;
    public readonly mysqlHost = process.env.DB_HOST || "localhost";
    public readonly mysqlUser = process.env.DB_USER || "root";
    public readonly mysqlPassword = process.env.DB_PASSWORD || "";
    public readonly mysqlDatabase = process.env.DB_NAME || "vacastream";
}

export const appConfig = new AppConfig();
