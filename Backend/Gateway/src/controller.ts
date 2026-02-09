import { jwtMiddleware } from "@yd/jwt";
import express, { Request, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { appConfig } from "./app-config";

class Controller {

    public readonly router: Router = express.Router();

    constructor() {

        // Auth Microservice — no JWT needed:
        const authProxy = createProxyMiddleware({ target: appConfig.authUrl });
        this.router.post("/api/auth/register", authProxy);
        this.router.post("/api/auth/login", authProxy);

        // Vacation Microservice — JWT required, forward user info as headers:
        const vacationProxy = createProxyMiddleware({
            target: appConfig.vacationUrl,
            on: {
                proxyReq: (proxyReq, req) => {
                    const expressReq = req as Request;
                    if (expressReq.user) {
                        proxyReq.setHeader("x-user-id", expressReq.user.userId.toString());
                        proxyReq.setHeader("x-user-role", expressReq.user.role);
                        proxyReq.setHeader("x-user-firstname", expressReq.user.firstName);
                        proxyReq.setHeader("x-user-lastname", expressReq.user.lastName);
                    }
                }
            }
        });

        // Static images — no JWT needed (must be before /api/vacations/:id):
        this.router.get("/api/vacations/images/:file", createProxyMiddleware({ target: appConfig.vacationUrl }));

        this.router.get("/api/vacations", jwtMiddleware, vacationProxy);
        this.router.get("/api/vacations/:id", jwtMiddleware, vacationProxy);
        this.router.post("/api/vacations", jwtMiddleware, vacationProxy);
        this.router.put("/api/vacations/:id", jwtMiddleware, vacationProxy);
        this.router.delete("/api/vacations/:id", jwtMiddleware, vacationProxy);

        // Likes — JWT required:
        this.router.post("/api/likes/:vacationId", jwtMiddleware, vacationProxy);
        this.router.delete("/api/likes/:vacationId", jwtMiddleware, vacationProxy);

        // Reports — JWT required:
        this.router.get("/api/reports", jwtMiddleware, vacationProxy);
        this.router.get("/api/reports/csv", jwtMiddleware, vacationProxy);
    }
}

export const controller = new Controller();
