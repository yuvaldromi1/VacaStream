import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { appConfig } from "./app-config";
import { controller } from "./controller";

class App {

    public async start(): Promise<void> {
        try {
            const server = express();

            // Helmet middleware for security headers:
            server.use(helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        imgSrc: ["'self'", "data:", "http://localhost:3000"],
                        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
                    },
                },
                crossOriginResourcePolicy: { policy: "cross-origin" },
            }));

            // Rate limiter middleware:
            const limiter = rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 1000,
                message: "Too many requests from this IP, please try again later.",
                standardHeaders: true,
                legacyHeaders: false,
            });
            server.use(limiter);

            // CORS — allow frontend origin (support Vite port fallback):
            server.use(cors({
                origin: [appConfig.frontendUrl, "http://localhost:5173", "http://localhost:5174"],
            }));

            // Proxy routes:
            server.use(controller.router);

            server.listen(appConfig.port, () =>
                console.log("Gateway listening on http://localhost:" + appConfig.port)
            );
        }
        catch (err: unknown) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();
