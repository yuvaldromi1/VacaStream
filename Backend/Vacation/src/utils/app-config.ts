import dotenv from "dotenv";
dotenv.config();

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly mysqlHost = process.env.DB_HOST;
    public readonly mysqlUser = process.env.DB_USER;
    public readonly mysqlPassword = process.env.DB_PASSWORD;
    public readonly mysqlDatabase = process.env.DB_NAME;
}

export const appConfig = new AppConfig();
